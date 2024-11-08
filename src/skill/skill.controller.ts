import {
    Body,
    Controller,
    Delete,
    Get,
    MessageEvent,
    Param,
    Post,
    Put,
    Query,
    Sse,
    UseGuards,
} from "@nestjs/common";
import { SkillsService } from "./skill.service";
import { Skill, SkillType } from "./entities/skill.entity";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";
import { fromEvent, map, Observable } from "rxjs";
import { ResponseSkillDto } from "./dto/response-skill.dto";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from '../metadata';

@ApiTags('skills')
@Controller("skills")
export class SkillsController {
    constructor(
        private readonly skillsService: SkillsService
    ) {}

    @Public()
    @Sse("stream")
    skillUpdates(): Observable<any> {
        const eventSource = fromEvent(
            this.skillsService.eventEmitter,
            "skillEvent"
        );
        return eventSource.pipe(
            map((event) => event as MessageEvent)
        );
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all skills with filters' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns filtered skills with pagination',
        type: [ResponseSkillDto] 
    })
    @ApiQuery({ name: 'query', required: false, description: 'Search query string' })
    @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags' })
    @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
    @ApiQuery({ 
        name: 'type', 
        required: false, 
        enum: SkillType,
        description: 'Filter by skill type (OFFER or REQUEST)' 
    })
    @ApiQuery({ name: 'date', required: false, description: 'Filter by date' })
    @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
    @ApiQuery({ 
        name: 'order', 
        required: false, 
        description: 'Sort order (asc or desc)',
        enum: ['asc', 'desc'] 
    })
    @ApiQuery({ 
        name: 'page', 
        required: false, 
        description: 'Page number', 
        type: Number,
        example: 1 
    })
    @ApiQuery({ 
        name: 'pageSize', 
        required: false, 
        description: 'Number of items per page', 
        type: Number,
        example: 10 
    })
    async findSkillsByCriteria(
        @Query("query") query?: string,
        @Query("tags") tags?: string,
        @Query("category") category?: string,
        @Query("type") type?: SkillType,
        @Query("date") date?: string,
        @Query("location") location?: string,
        @Query("order") order?: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10
    ) {
        return this.skillsService.advancedSearch({
            query, tags, category, type, page,
            pageSize, date, location, order,
        });
    }

    @Public()
    @Get("tags")
    async findAllSkillTags(@Query("query") query?: string): Promise<String[]> {
        if (query) {
            return this.skillsService.searchTags(query);
        }
        return this.skillsService.getAllTags();
    }

    @Public()
    @Get("type")
    async findAllSkillTypes(): Promise<String[]> {
        return this.skillsService.getAllSkillTypes();
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: 'Get skill by ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns the skill',
        type: ResponseSkillDto 
    })
    async findSkillById(@Param("id") id: string): Promise<Skill> {
        return this.skillsService.findSkillById(id);
    }

    @Public()
    @Get("items/type/:type")
    async findSkillsByType(@Param("type") type: SkillType): Promise<Skill[]> {
        return this.skillsService.findSkillsByType(type);
    }

    // Protected routes below
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post()
    @ApiOperation({ summary: 'Create a new skill' })
    @ApiResponse({ 
        status: 201, 
        description: 'Skill created successfully',
        type: ResponseSkillDto 
    })
    async createSkill(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
        return this.skillsService.create(createSkillDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post("many")
    async createSkills(
        @Body() createSkillDtos: CreateSkillDto[]
    ): Promise<Skill[]> {
        return this.skillsService.createSkills(createSkillDtos);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Put(":id")
    @ApiOperation({ summary: 'Update skill' })
    @ApiResponse({ 
        status: 200, 
        description: 'Skill updated successfully',
        type: ResponseSkillDto 
    })
    async updateSkill(
        @Param("id") id: string,
        @Body() updateSkillDto: UpdateSkillDto
    ): Promise<Skill> {
        return this.skillsService.update(id, updateSkillDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Delete(":id")
    @ApiOperation({ summary: 'Delete skill' })
    @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
    async deleteSkill(@Param("id") id: string): Promise<void> {
        return this.skillsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Delete("items/:id")
    async deleteSkillItem(@Param("id") id: string): Promise<void> {
        return this.skillsService.delete(id);
    }
}
