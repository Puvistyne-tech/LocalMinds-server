import { Model } from 'mongoose';
import { Skill } from './entities/skill.entity';
import { Link, SkillItem, Text } from './entities/skillTtem.entity';
import { Work } from './entities/work.document';
import { Photo } from './entities/photo.document';
import { CreateSkillItemDto } from './dto/create-skill-item.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Category } from "../category/entities/category.entity";
import { UpdateSkillDto } from "./dto/update-skill.dto";
export declare class SkillsService {
    private skillModel;
    private photoModel;
    private linkModel;
    private workModel;
    private textModel;
    private categoryModel;
    constructor(skillModel: Model<Skill>, photoModel: Model<Photo>, linkModel: Model<Link>, workModel: Model<Work>, textModel: Model<Text>, categoryModel: Model<Category>);
    create(createSkillDto: CreateSkillDto): Promise<Skill>;
    findSkillById(id: string): Promise<Skill>;
    findAll(): Promise<Skill[]>;
    findAllSkills(): Promise<Skill[]>;
    findSkillsByCriteria(criteria: {
        name?: string;
        tags?: string | string[];
        category?: string;
    }): Promise<Skill[]>;
    private getSkillItemModel;
    findSkillItemsBySkillId(skillId: string): Promise<SkillItem[]>;
    findSkillItemsByType(type: string): Promise<any[]>;
    createDemo(): Promise<Skill>;
    createSkill(skill: Skill): Promise<Skill>;
    update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill>;
    delete(id: string): Promise<void>;
    createSkillItem(createSkillItemDto: CreateSkillItemDto): Promise<import("mongoose").Document<unknown, {}, Text> & Text & Required<{
        _id: unknown;
    }>> | Promise<import("mongoose").Document<unknown, {}, Link> & Link & Required<{
        _id: unknown;
    }>> | Promise<import("mongoose").Document<unknown, {}, Photo> & Photo & Required<{
        _id: unknown;
    }>> | Promise<import("mongoose").Document<unknown, {}, Work> & Work & Required<{
        _id: unknown;
    }>>;
}
