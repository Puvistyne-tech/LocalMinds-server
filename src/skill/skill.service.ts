import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, PaginateModel} from "mongoose";
import {Skill, SkillType} from "./entities/skill.entity";
import {CreateSkillDto} from "./dto/create-skill.dto";
import {UpdateSkillDto} from "./dto/update-skill.dto";
import {UserService} from "../user/user.service";
import {EventEmitter} from "events";
import {ResponseSkillDto} from "./dto/response-skill.dto";
import {SkillFilter} from "./SkillFilter";
import {HydratedDocument} from "mongoose";

// import {EventEmitter2} from '@nestjs/event-emitter';

enum SkillEventType {
    DELETE = "SKILL_DELETE",
    UPDATE = "SKILL_UPDATE",
    ADD = "SKILL_ADD",
}

@Injectable()
export class SkillsService {
    readonly eventEmitter = new EventEmitter(); // Create an EventEmitter

    constructor(
        @InjectModel("Skill") private readonly skillModel: Model<Skill>,
        @InjectModel("Skill") private readonly skillModelPag: PaginateModel<Skill>,
        private readonly userService: UserService
        // private eventEmitter: EventEmitter2
    ) {
    }

    // Find all skills
    async findAll(): Promise<Skill[]> {
        return this.skillModel.find().exec();
    }

    //get the skillTYpes
    async getAllSkillTypes(): Promise<String[]> {
        return Object.values(SkillType);
    }


    async advancedSearch(
        options: SkillFilter
    ): Promise<{
        skills: ResponseSkillDto[];
        totalPages: number;
        nextPage: number | null;  // Next page will be null if there is no next page
        previousPage: number | null; // Previous page will be null if it's the first page
        page: number;
        hasNextPage: boolean;
    }> {
        const query: any = {}; // Build the query object based on filter options

        console.log(options);

        // Use regex for case-insensitive search across multiple fields
        if (options.query) {
            query.$or = [
                {title: {$regex: options.query, $options: "i"}},
                {content: {$regex: options.query, $options: "i"}},
            ];
        }

        // Handle the `tags` filtering
        if (options.tags) {
            const tagsArray = options.tags.split(",").map((tag) => tag.trim());
            query.tags = {$all: tagsArray};
        }

        if (options.category) {
            query.category = options.category;
        }

        // Handle the `type` filtering with case-insensitivity
        if (options.type) {
            query.type = options.type;
        }

        if (options.date) {
            const dateRange = this.getDateRange(options.date);
            if (dateRange) {
                query.date_modified = {$gte: dateRange.start, $lte: dateRange.end};
            }
        }

        if (options.location) {
            query.location = {$regex: options.location, $options: "i"}; // Case-insensitive search
        }

        // Prepare sorting options
        const sortOptions: any = {};
        if (options.order === 'ASCENDING') {
            sortOptions.date_modified = 1; // 1 for ascending
        } else if (options.order === 'DESCENDING') {
            sortOptions.date_modified = -1; // -1 for descending
        } else {
            sortOptions.date_modified = -1; // Default to descending (new to old)
        }

        const paginationOptions: any = {
            page: options.page || 1, // Default to page 1 if not provided
            limit: options.pageSize || 10, // Default limit if not provided
            sort: sortOptions, // Add sorting options here
            populate: "user",
        };

        // Perform the pagination and fetch the results
        const result = await this.skillModelPag.paginate(query, paginationOptions);

        // Prepare the response
        return {
            skills: ResponseSkillDto.many(result.docs as Array<HydratedDocument<Skill, {}, {}>>),
            totalPages: result.totalPages,
            nextPage: result.nextPage, // If there's a next page, calculate it
            previousPage: result.prevPage, // If it's not the first page
            page: result.page, // Current page
            hasNextPage: result.hasNextPage, // Whether there is a next page
        };
    }


    private getDateRange(dateOption: string): { start: Date; end: Date } | null {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        switch (dateOption) {
            case "TODAY":
                return {start: today, end: today};
            case "YESTERDAY":
                start.setDate(today.getDate() - 1);
                return {start: start, end: today};
            case "THREE_DAYS":
                start.setDate(today.getDate() - 3);
                return {start: start, end: today};
            case "WEEK":
                start.setDate(today.getDate() - 7);
                return {start: start, end: today};
            case "MONTH":
                start.setMonth(today.getMonth() - 1);
                return {start: start, end: today};
            case "SIX_MONTHS":
                start.setMonth(today.getMonth() - 6);
                return {start: start, end: today};
            case "YEAR":
                start.setFullYear(today.getFullYear() - 1);
                return {start: start, end: today};
            default:
                // Handle invalid or unsupported date options
                return null;
        }
    }


    // async advancedSearch(
    //     options: SkillFilter
    // ): Promise<{ skills: ResponseSkillDto[]; totalPages: number }> {
    //     const query: any = {}; // Build the query object based on filter options
    //
    //     // Use regex for case-insensitive search across multiple fields
    //     if (options.query) {
    //         query.$or = [
    //             {title: {$regex: options.query, $options: "i"}},
    //             {content: {$regex: options.query, $options: "i"}},
    //         ];
    //     }
    //
    //     // Handle the `tags` filtering
    //     if (options.tags) {
    //         const tagsArray = options.tags.split(",").map((tag) => tag.trim());
    //         query.tags = {$all: tagsArray};
    //     }
    //
    //     if (options.category) {
    //         query.category = options.category;
    //     }
    //
    //     // Handle the `type` filtering with case-insensitivity
    //     if (options.type) {
    //         query.type = options.type;
    //     }
    //
    //     if (options.date) {
    //         const dateRange = this.getDateRange(options.date);
    //         if (dateRange) {
    //             query.date_modified = {$gte: dateRange.start, $lte: dateRange.end};
    //         }
    //     }
    //
    //     if (options.location) {
    //         query.location = {$regex: options.location, $options: "i"}; // Case-insensitive search
    //     }
    //
    //     if (options.page && options.pageSize) {
    //         // Perform pagination only if page and pageSize are provided
    //         const paginationOptions = {
    //             page: options.page,
    //             limit: options.pageSize,
    //             populate: "user",
    //         };
    //
    //         const result = await this.skillModelPag.paginate(
    //             query,
    //             paginationOptions
    //         );
    //         return {
    //             skills: ResponseSkillDto.many(result.docs),
    //             totalPages: result.totalPages,
    //         };
    //     } else {
    //         // If no pagination options, fetch all matching skills
    //         const skills = await this.skillModel.find(query).exec();
    //         const totalPages: number = 1; // Total count is the length of the fetched skills array
    //
    //         return {
    //             skills: ResponseSkillDto.many(skills),
    //             totalPages,
    //         };
    //     }
    // }
    //
    // private getDateRange(dateOption: string): { start: Date; end: Date } | null {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0); // Start of today
    //     const start = new Date();
    //     start.setHours(0, 0, 0, 0);
    //
    //     switch (dateOption) {
    //         case "TODAY":
    //             return {start: today, end: today};
    //         case "YESTERDAY":
    //             start.setDate(today.getDate() - 1);
    //             return {start: start, end: today};
    //         case "THREE_DAYS":
    //             start.setDate(today.getDate() - 3);
    //             return {start: start, end: today};
    //         case "WEEK":
    //             start.setDate(today.getDate() - 7);
    //             return {start: start, end: today};
    //         case "MONTH":
    //             start.setMonth(today.getMonth() - 1);
    //             return {start: start, end: today};
    //         case "SIX_MONTHS":
    //             start.setMonth(today.getMonth() - 6);
    //             return {start: start, end: today};
    //         case "YEAR":
    //             start.setFullYear(today.getFullYear() - 1);
    //             return {start: start, end: today};
    //         default:
    //             // Handle invalid or unsupported date options
    //             return null;
    //     }
    // }

    async getAllTags(): Promise<string[]> {
        const result = await this.skillModel.aggregate([
            {$unwind: "$tags"}, // Deconstructs the tags array
            {$group: {_id: null, uniqueTags: {$addToSet: "$tags"}}}, // Collects unique tags
            {$project: {_id: 0, uniqueTags: 1}}, // Project only the uniqueTags field
        ]);
        return result.length > 0 ? result[0].uniqueTags : [];
    }

    // Find a skill by ID
    async findSkillById(id: string): Promise<Skill> {
        const skill = await this.skillModel.findById(id).exec();
        if (!skill) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }
        return skill;
    }

    // Find skill items by type
    async findSkillsByType(type: SkillType): Promise<Skill[]> {
        return this.skillModel.find({type}).exec();
    }

    // Create a new skill
    async create(createSkillDto: CreateSkillDto): Promise<Skill> {
        const createdSkill = new this.skillModel(createSkillDto);
        const user = await this.userService.findOneById(createSkillDto.userId);
        if (!user) {
            throw new NotFoundException(
                `User with ID ${createSkillDto.userId} not found`
            );
        }
        createdSkill.user = user;
        // return createdSkill.save();
        const savedSkill = await createdSkill.save();

        // Emit an event after creating a new skill
        this.eventEmitter.emit("skillEvent", {
            type: SkillEventType.ADD,
            data: savedSkill,
        });

        return savedSkill;
    }

    // Update an existing skill by ID
    async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
        const updatedSkill = await this.skillModel
            .findByIdAndUpdate(id, updateSkillDto, {new: true})
            .populate("user")
            .exec();
        if (!updatedSkill) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }

        // Emit an event after updating a skill
        this.eventEmitter.emit("skillEvent", {
            type: SkillEventType.UPDATE,
            data: updatedSkill,
        });

        return updatedSkill;
    }

    // Delete a skill by ID
    async delete(id: string): Promise<void> {
        const result = await this.skillModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }
        this.eventEmitter.emit("skillEvent", {
            type: SkillEventType.DELETE,
            data: result.id,
        });
    }

    async createSkills(createSkillDtos: CreateSkillDto[]): Promise<Skill[]> {
        const skills: Skill[] = []; // Initialize an empty array to store created skills

        for (const skillDto of createSkillDtos) {
            const newSkill = new this.skillModel(skillDto);
            const savedSkill = await newSkill.save();
            skills.push(savedSkill);
        }

        return skills;
    }

    // findAllStream(): Observable<Skill[]> {
    //     // Fetch skills from the database (adjust as needed)
    //     const skillsPromise = this.skillModel.find().exec();
    //
    //     // Convert the Promise to an Observable
    //     return from(skillsPromise);
    // }

    // Find skills with pagination
    // Find skills with pagination using mongoose-paginate-v2
    async findPaginated(
        page: number,
        pageSize: number
    ): Promise<{
        skills: ResponseSkillDto[];
        totalPages: number,
        nextPage: number,
        previousPage: number,
        page: number,
        hasNextPage: boolean,
    }> {
        const options = {
            page,
            limit: pageSize,
            sort: {date_created: -1}, // Sorting by date_created in descending order
            populate: "user", // Populating the user field
        };

        const result = await this.skillModelPag.paginate({}, options);

        const skillDtos = ResponseSkillDto.many(result.docs);
        const pageCount = result.totalPages; // Total number of pages

        return {
            skills: skillDtos,
            totalPages: result.totalPages,
            nextPage: result.nextPage,
            previousPage: result.prevPage,
            page: result.page,
            hasNextPage: result.hasNextPage,
        };
    }

    async searchTags(query: string): Promise<string[]> {
        const skills = await this.skillModel
            .find({tags: {$regex: query, $options: "i"}}) // Case-insensitive search
            .select("tags") // Only retrieve the tags field
            .exec();

        const tagsSet = new Set<string>();
        skills.forEach((skill) => {
            skill.tags.forEach((tag) => {
                if (tag.toLowerCase().includes(query.toLowerCase())) {
                    tagsSet.add(tag);
                }
            });
        });

        return Array.from(tagsSet); // Return unique tags as an array
    }

    getSkillTypes() {
        return Object.values(SkillType);
    }
}
