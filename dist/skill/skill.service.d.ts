/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model } from 'mongoose';
import { Skill } from './entities/skill.entity';
import { Link, SkillItem, Text } from './entities/skillTtem.entity';
import { Work } from './entities/work.document';
import { Photo } from './entities/photo.document';
import { CreateSkillItemDto } from './dto/create-skill-item.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
export declare class SkillsService {
    private skillModel;
    private photoModel;
    private linkModel;
    private workModel;
    private textModel;
    constructor(skillModel: Model<Skill>, photoModel: Model<Photo>, linkModel: Model<Link>, workModel: Model<Work>, textModel: Model<Text>);
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
    update(id: string, updateSkillDto: {
        name?: string;
        description?: string;
        tags?: string[];
        category?: string;
        skillItems?: {
            order: number;
            type: string;
            [key: string]: any;
        }[];
    }): Promise<Skill>;
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
