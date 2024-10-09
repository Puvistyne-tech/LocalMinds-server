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
} from "@nestjs/common";
import {SkillsService} from "./skill.service";
import {Skill, SkillType} from "./entities/skill.entity";
import {CreateSkillDto} from "./dto/create-skill.dto";
import {UpdateSkillDto} from "./dto/update-skill.dto";
import {fromEvent, map, Observable} from "rxjs";
import {ResponseSkillDto} from "./dto/response-skill.dto";

@Controller("skills")
export class SkillsController {
    constructor(
        private readonly skillsService: SkillsService
        // private eventEmitter: EventEmitter2
    ) {
    }

    // @Get()
    // async findAll(): Promise<Skill[]> {
    //     return this.skillsService.findAll();
    // }

    // @Get()
    // findPaginated(
    //     @Query("page") page: number = 1,
    //     @Query("pageSize") pageSize: number = 10
    // ): Promise<{
    //     skills: ResponseSkillDto[]; totalPages: number, nextPage: number,
    //     previousPage: number,
    //     page: number,
    //     hasNextPage: boolean,
    // }> {
    //     return this.skillsService.findPaginated(page, pageSize);
    // }

    @Sse("stream")
    skillUpdates(): Observable<any> {
        // Replace with your actual event source (e.g., from a database change stream)

        const eventSource = fromEvent(
            this.skillsService.eventEmitter,
            "skillEvent"
        );
        return eventSource.pipe(
            map((event) => event as MessageEvent)
        );
    }

    // @Sse('stream')
    // findAllStream(): Observable<MessageEvent> {
    //     return interval(5000)
    //         .pipe(
    //             mergeMap(() => {
    //                 return from(this.skillsService.findAllStream())
    //                     .pipe(
    //                         map(skills => ({data: skills})), // Wrap skills in a simple object
    //                         map(data => new MessageEvent('message', {data})) // Create a MessageEvent
    //                     );
    //             })
    //         );
    // }

    @Get()
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
    ): Promise<{
        skills: ResponseSkillDto[]; totalPages: number, nextPage: number,
        previousPage: number,
        page: number,
        hasNextPage: boolean,
    }> {
        // console.log("advanced serach");
        const res = this.skillsService.advancedSearch({
            query,
            tags,
            category,
            type,
            page,
            pageSize,
            date,
            location,
            order,
        });
        // console.log(res);
        return res;
    }

    @Get("tags")
    async findAllSkillTags(@Query("query") query?: string): Promise<String[]> {
        if (query) {
            return this.skillsService.searchTags(query);
        }
        return this.skillsService.getAllTags();
    }

    @Get("type")
    async findAllSkillTypes(): Promise<String[]> {
        return this.skillsService.getAllSkillTypes();
    }

    @Get(":id")
    async findSkillById(@Param("id") id: string): Promise<Skill> {
        return this.skillsService.findSkillById(id);
    }

    @Get("items/type/:type")
    async findSkillsByType(@Param("type") type: SkillType): Promise<Skill[]> {
        return this.skillsService.findSkillsByType(type);
    }

    // Create a new skill
    @Post()
    async createSkill(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
        // console.log(createSkillDto);
        return this.skillsService.create(createSkillDto);
    }

    @Post("many")
    async createSkills(
        @Body() createSkillDtos: CreateSkillDto[]
    ): Promise<Skill[]> {
        return this.skillsService.createSkills(createSkillDtos);
    }

    // Update an existing skill by ID
    @Put(":id")
    async updateSkill(
        @Param("id") id: string,
        @Body() updateSkillDto: UpdateSkillDto
    ): Promise<Skill> {
        return this.skillsService.update(id, updateSkillDto);
    }

    // Delete a skill by ID
    @Delete(":id")
    async deleteSkill(@Param("id") id: string): Promise<void> {
        return this.skillsService.delete(id);
    }

    // Delete a skill item by ID
    @Delete("items/:id")
    async deleteSkillItem(@Param("id") id: string): Promise<void> {
        return this.skillsService.delete(id);
    }
}
