// import {Injectable, NotFoundException} from '@nestjs/common';
// import {InjectModel} from '@nestjs/mongoose';
// import {model, Model} from 'mongoose';
// import {Skill} from './entities/skill.entity';
// import {
//     LinkSkillItem,
//     PhotoSkillItem,
//     SkillItem,
//     SkillItemType,
//     TextSkillItem,
//     WorkSkillItem,
// } from './entities/skillTtem.entity';
// import {CreateSkillItemDto} from './dto/create-skill-item.dto';
// import {CreateSkillDto} from './dto/create-skill.dto';
// import {UpdateSkillItemDto} from "./dto/update-skill-item.dto";
//
// @Injectable()
// export class SkillsService {
//     constructor(
//         @InjectModel('Skill') private skillModel: Model<Skill>,
//         private textModel: TextSkillItem,
//         private photoModel: PhotoSkillItem,
//         private workModel: WorkSkillItem,
//         private linkModel: LinkSkillItem
//     ) {
//     }
//
//     // Create a new skill
//     async create(createSkillDto: CreateSkillDto): Promise<Skill> {
//
//         const createdSkill = new this.skillModel(createSkillDto);
//         return createdSkill.save();
//
//         // const skill_items = await Promise.all(
//         //     createSkillDto.skill_items.map(async (item: CreateSkillItemDto) => {
//         //         return this.createSkillItem(item);
//         //     }),
//         // );
//         //
//         // // Create and save the Skill instance
//         // const createdSkill = new this.skillModel({
//         //     name: createSkillDto.name,
//         //     description: createSkillDto.description,
//         //     date_created: new Date(),
//         //     date_modified: new Date(),
//         //     tags: createSkillDto.tags,
//         //     category: createSkillDto.category,
//         //     skill_items: skill_items,
//         // });
//         //
//         // return createdSkill.save();
//     }
//
//     async findSkillById(id: string): Promise<Skill> {
//         const skill = await this.skillModel
//             .findById(id)
//             .populate('skill_items')
//             .exec();
//         if (!skill) {
//             throw new NotFoundException(`Skill with ID ${id} not found`);
//         }
//         return skill;
//     }
//
//     async findAll(): Promise<Skill[]> {
//         return this.skillModel.find().exec();
//     }
//
//     async findAllSkills(): Promise<Skill[]> {
//         return this.skillModel.find().populate('skill_items').exec();
//     }
//
//     async findSkillsByCriteria(criteria: {
//         name?: string;
//         tags?: string | string[];
//         category?: string;
//     }): Promise<Skill[]> {
//         const exactQuery: any = {};
//         const partialQuery: any = {};
//
//         if (criteria.name) {
//             exactQuery.name = criteria.name; // Exact match for name
//             partialQuery.name = {$regex: criteria.name, $options: 'i'}; // Partial match for name
//         }
//
//         if (criteria.tags) {
//             // Convert tags to an array if it's not already one
//             const tagsArray = Array.isArray(criteria.tags)
//                 ? criteria.tags
//                 : [criteria.tags];
//
//             exactQuery.tags = {$all: tagsArray}; // Exact match for tags (all tags must be present)
//
//             // Create regex patterns for each tag for partial matches
//             const tagRegexes = tagsArray.map((tag) => new RegExp(tag, 'i'));
//
//             // Match documents that have at least one of the tags matching any regex
//             partialQuery.tags = {$all: tagRegexes};
//         }
//         if (criteria.category) {
//             exactQuery.category = criteria.category; // Exact match for category
//             partialQuery.category = criteria.category; // PartialQuery includes exact match for category
//         }
//
//         // Execute the exact match query first
//         const exactMatches = await this.skillModel
//             .find(exactQuery)
//             .populate('skill_items')
//             .exec();
//
//         // Execute the partial match query and filter out duplicates
//         const partialMatches = await this.skillModel
//             .find(partialQuery)
//             .populate('skill_items')
//             .exec();
//
//         // Combine results, ensuring no duplicates
//         return exactMatches.concat(
//             partialMatches.filter(
//                 (partialItem) =>
//                     !exactMatches.some((exactItem) =>
//                         (exactItem._id as any).equals(partialItem._id),
//                     ),
//             ),
//         );
//     }
//
//     private getSkillItemModel(type: string): model<SkillItem> {
//         type = type.toLowerCase(); // Normalize type to lowercase
//
//         switch (type) {
//             case SkillItemType.TEXT.toLowerCase():
//                 return this.textModel;
//             case SkillItemType.PHOTO.toLowerCase():
//                 return this.photoModel;
//             case SkillItemType.LINK.toLowerCase():
//                 return this.linkModel;
//             case SkillItemType.WORK.toLowerCase():
//                 return this.workModel;
//             default:
//                 throw new NotFoundException(`Unknown SkillItem type: ${type}`);
//         }
//     }
//
//     async findSkillItemsBySkillId(skillId: string): Promise<SkillItem[]> {
//         const skill = await this.skillModel
//             .findById(skillId)
//             .populate('skill_items')
//             .exec();
//         if (!skill) {
//             throw new Error(`Skill with ID ${skillId} not found`);
//         }
//         return skill.skill_items;
//     }
//
//     async findSkillItemsByType(type: string): Promise<any[]> {
//         type = type.toLowerCase(); // Normalize type to lowercase
//
//         if (
//             !Object.values(SkillItemType)
//                 .map((t) => t.toLowerCase())
//                 .includes(type)
//         ) {
//             throw new NotFoundException(`SkillItem type ${type} not found`);
//         }
//
//         const model = this.getSkillItemModel(type);
//         return model.find().exec();
//     }
//
//     // async createDemo() {
//     //     // Create instances of skill items
//     //
//     //     const demoText = new TextSkillItem({
//     //         order: 1,
//     //         text: 'This is a sample text item.',
//     //         type: 'Text',
//     //     });
//     //
//     //     const demoLink = new LinkSkillItem({
//     //         order: 2,
//     //         link: 'https://example.com',
//     //         description: 'This is a sample link item.',
//     //     });
//     //
//     //     const demoPhoto = new PhotoSkillItem({
//     //         order: 3,
//     //         content: 'photo1.jpg',
//     //         name: 'First Photo',
//     //         type: 'Photo',
//     //     });
//     //
//     //     const demoWork = new WorkSkillItem({
//     //         order: 4,
//     //         name: 'Project XYZ',
//     //         description: 'A detailed project description.',
//     //         location: 'New York, NY',
//     //         time_slots: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
//     //     });
//     //
//     //     // Combine the skill items into an array
//     //     const skill_items = [demoText, demoLink, demoPhoto, demoWork];
//     //
//     //     // Create a Skill instance using the Mongoose model
//     //     const demoSkill = new this.skillModel({
//     //         name: 'Sample Skill',
//     //         description: 'This is a sample skill description.',
//     //         date_created: new Date(),
//     //         date_modified: new Date(),
//     //         tags: ['Sample Skill'],
//     //         category: 'Sample Skill',
//     //         skill_items: skill_items,
//     //     });
//     //
//     //     // Save the Skill to the database
//     //     return this.createSkill(demoSkill);
//     // }
//
//     async createSkill(skill: Skill): Promise<Skill> {
//         const createdSkill = new this.skillModel(skill);
//         return createdSkill.save();
//     }
//
//     async update(
//         id: string,
//         updateSkillDto: UpdateSkillItemDto,
//     ): Promise<Skill> {
//         // Find the existing Skill
// // Find the existing Skill
//         const existingSkill = await this.skillModel.findById(id).exec();
//         if (!existingSkill) {
//             throw new Error(`Skill with ID ${id} not found`);
//         }
//
//         // Update Skill fields
//         if (updateSkillDto.name) existingSkill.name = updateSkillDto.name;
//         if (updateSkillDto.description) existingSkill.description = updateSkillDto.description;
//         if (updateSkillDto.tags) existingSkill.tags = updateSkillDto.tags;
//         if (updateSkillDto.category) {
//             // existingSkill.category = updateSkillDto.category;
//         }
//
//         // Handle SkillItems update
//         if (updateSkillDto.skill_items) {
//             existingSkill.skill_items = await Promise.all(
//                 updateSkillDto.skill_items.map(async (item) => {
//                     return this.createSkillItem(item); // Reuse the method to create or update skill items
//                 }),
//             );
//         }
//
//         existingSkill.date_modified = new Date();
//
//         return existingSkill.save();
//     }
//
//     // async delete(id: string): Promise<void> {
//     //     const result = await this.skillModel.findByIdAndDelete(id).exec();
//     //     if (!result) {
//     //         throw new Error(`Skill with ID ${id} not found`);
//     //     }
//     //
//     //     // Optionally delete related SkillItems
//     //     // Uncomment if you want to also delete SkillItems from the database
//     //     await Promise.all(
//     //         result.skill_items.map(async (item) => {
//     //             switch (item.type) {
//     //                 case SkillItemType.TEXT:
//     //                     return this.textModel.findByIdAndDelete(item._id).exec();
//     //                 case SkillItemType.LINK:
//     //                     return this.linkModel.findByIdAndDelete(item._id).exec();
//     //                 case SkillItemType.PHOTO:
//     //                     return this.photoModel.findByIdAndDelete(item._id).exec();
//     //                 case SkillItemType.WORK:
//     //                     return this.workModel.findByIdAndDelete(item._id).exec();
//     //             }
//     //         }),
//     //     );
//     // }
//
//     createSkillItem(createSkillItemDto: CreateSkillItemDto | UpdateSkillItemDto) {
//         switch (createSkillItemDto.type) {
//             case SkillItemType.TEXT:
//                 return new this.textModel({
//                     order: createSkillItemDto.order,
//                     text: createSkillItemDto.content, // Assuming content for Text item
//                 }).save();
//             case SkillItemType.LINK:
//                 return new this.linkModel({
//                     order: createSkillItemDto.order,
//                     link: createSkillItemDto.link,
//                     description: createSkillItemDto.description,
//                 }).save();
//             case SkillItemType.PHOTO:
//                 return new this.photoModel({
//                     order: createSkillItemDto.order,
//                     content: createSkillItemDto.content,
//                     name: createSkillItemDto.name,
//                     type: createSkillItemDto.type,
//                 }).save();
//             case SkillItemType.WORK:
//                 return new this.workModel({
//                     order: createSkillItemDto.order,
//                     name: createSkillItemDto.name,
//                     description: createSkillItemDto.description,
//                     location: createSkillItemDto.location, // Assuming content holds location
//                     time_slots: createSkillItemDto.time_slots, // Assuming content holds time slots
//                 }).save();
//             default:
//                 throw new Error(`Unknown SkillItem type: ${SkillItemType}`);
//         }
//     }
// }


import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Skill, SkillItem} from './entities/skill.entity';
import {CreateSkillDto} from './dto/create-skill.dto';
import {CreateSkillItemDto} from './dto/create-skill-item.dto';
import {UpdateSkillItemDto} from './dto/update-skill-item.dto';
import {SkillItemType} from "./entities/skillTtem.entity";

@Injectable()
export class SkillsService {
    constructor(
        @InjectModel('Skill') private readonly skillModel: Model<Skill>,
        @InjectModel('SkillItem') private readonly skillItemModel: Model<SkillItem>,
    ) {
    }

    // Create a demo skill (for testing purposes)
    async createDemo(): Promise<Skill> {
        // Example demo data
        const demoSkill: CreateSkillDto = {
            name: 'Demo Skill',
            description: 'This is a demo skill.',
            category: 'Demo Category',
            tags: ['demo'],
            skill_items: [
                {type: SkillItemType.TEXT, order: 1, content: 'Demo text content'},
                {type: SkillItemType.LINK, order: 2, url: 'https://example.com'},
            ],
        };
        return this.create(demoSkill);
    }

    // Find all skills
    async findAll(): Promise<Skill[]> {
        return this.skillModel.find().exec();
    }

    // Find skills by criteria
    async findSkillsByCriteria(
        criteria: { name?: string; tags?: string[]; category?: string },
    ): Promise<Skill[]> {
        return this.skillModel.find({
            ...criteria,
            tags: {$in: criteria.tags || []}, // Ensure tags are matched if provided
        }).exec();
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
    async findSkillItemsByType(type: string): Promise<SkillItem[]> {
        return this.skillItemModel.find({type}).exec();
    }

    // Find skill items by skill ID
    async findSkillItemsBySkillId(skillId: string): Promise<SkillItem[]> {
        const skill = await this.skillModel.findById(skillId).exec();
        if (!skill) {
            throw new NotFoundException(`Skill with ID ${skillId} not found`);
        }
        return skill.skill_items;
    }

    // Create a new skill
    async create(createSkillDto: CreateSkillDto): Promise<Skill> {
        const createdSkill = new this.skillModel(createSkillDto);
        return createdSkill.save();
    }

    // Update an existing skill by ID
    async update(id: string, updateSkillDto: UpdateSkillItemDto): Promise<Skill> {
        const updatedSkill = await this.skillModel.findByIdAndUpdate(id, updateSkillDto, {new: true}).exec();
        if (!updatedSkill) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }
        return updatedSkill;
    }

    // Delete a skill by ID
    async delete(id: string): Promise<void> {
        const result = await this.skillModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Skill with ID ${id} not found`);
        }
    }

    // Create a new skill item
    async createSkillItem(createSkillItemDto: CreateSkillItemDto): Promise<SkillItem> {
        const createdSkillItem = new this.skillItemModel(createSkillItemDto);
        return createdSkillItem.save();
    }

    // Update a skill item by ID
    async updateSkillItem(id: string, updateSkillItemDto: UpdateSkillItemDto): Promise<SkillItem> {
        const updatedSkillItem = await this.skillItemModel.findByIdAndUpdate(id, updateSkillItemDto, {new: true}).exec();
        if (!updatedSkillItem) {
            throw new NotFoundException(`Skill item with ID ${id} not found`);
        }
        return updatedSkillItem;
    }

    // Delete a skill item by ID
    async deleteSkillItem(id: string): Promise<void> {
        const result = await this.skillItemModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Skill item with ID ${id} not found`);
        }
    }
}
