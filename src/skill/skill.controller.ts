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
    Request,
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
import { HydratedDocument } from 'mongoose';

@ApiTags('skills')
@Controller("skills")
export class SkillsController {
    constructor(
        private readonly skillsService: SkillsService
    ) {}

    @Public()
    @Sse("stream")
    @ApiOperation({ 
        summary: 'Real-time skill updates stream',
        description: `
Server-Sent Events endpoint for real-time skill updates.
Emits events for the following actions:
- SKILL_ADD: When a new skill is created
- SKILL_UPDATE: When a skill is modified
- SKILL_DELETE: When a skill is deleted

Each event contains:
- type: The type of action (ADD/UPDATE/DELETE)
- data: The skill data or skill ID (for DELETE)
        `
    })
    @ApiResponse({ 
        status: 200, 
        description: 'SSE Stream established',
        schema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['SKILL_ADD', 'SKILL_UPDATE', 'SKILL_DELETE'],
                    description: 'Type of skill event'
                },
                data: {
                    oneOf: [
                        { $ref: '#/components/schemas/ResponseSkillDto' },
                        { 
                            type: 'string',
                            description: 'Skill ID (for DELETE events)'
                        }
                    ],
                    description: 'Event payload - full skill object for ADD/UPDATE, skill ID for DELETE'
                }
            },
            example: {
                type: 'SKILL_ADD',
                data: {
                    _id: '507f1f77bcf86cd799439011',
                    title: 'Web Development',
                    content: { text: 'Experienced in React and Node.js' },
                    tags: ['javascript', 'react'],
                    category: 'Programming',
                    type: 'OFFER',
                    status: false,
                    date_created: '2024-01-01T00:00:00.000Z',
                    date_modified: '2024-01-01T00:00:00.000Z',
                    user: {
                        _id: '507f1f77bcf86cd799439012',
                        username: 'johndoe',
                        email: 'john@example.com'
                    }
                }
            }
        }
    })
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
        @Query("subcategory") subcategory?: string,
        @Query("type") type?: SkillType,
        @Query("date") date?: string,
        @Query("location") location?: string,
        @Query("order") order?: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10
    ) {
        const result = await this.skillsService.advancedSearch({
            query, tags, category,subcategory, type, page,
            pageSize, date, location, order,
        });
        console.log(result.skills);
        return result;
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
    async createSkill(
        @Body() createSkillDto: CreateSkillDto,
        @Request() req
    ): Promise<ResponseSkillDto> {
        const skill = await this.skillsService.create(createSkillDto, req.user.userId);
        
        // Emit event for real-time updates
        this.skillsService.eventEmitter.emit("skillEvent", {
            type: "SKILL_ADD",
            data: skill
        });

        // Return the created skill as ResponseSkillDto
        return ResponseSkillDto.from(skill as HydratedDocument<Skill>);
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
