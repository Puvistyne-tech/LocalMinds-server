import { Document, Types } from 'mongoose';
export declare class Skill extends Document {
    name: string;
    description: string;
    date_created: Date;
    date_modified: Date;
    skill_items: any[];
    tags: string[];
    category: Types.ObjectId;
}
export type SkillDocument = Skill & Document;
export declare const SkillSchema: import("mongoose").Schema<Skill, import("mongoose").Model<Skill, any, any, any, Document<unknown, any, Skill> & Skill & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Skill, Document<unknown, {}, import("mongoose").FlatRecord<Skill>> & import("mongoose").FlatRecord<Skill> & Required<{
    _id: unknown;
}>>;
