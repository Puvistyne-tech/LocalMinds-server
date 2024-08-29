import { Document } from 'mongoose';
export declare enum SkillItemType {
    TEXT = "Text",
    LINK = "Link",
    PHOTO = "Photo",
    WORK = "Work"
}
export declare class SkillItem extends Document {
    order: number;
}
export declare class Text extends SkillItem {
    text: string;
}
export declare class Link extends SkillItem {
    link: string;
    description: string;
}
export declare const SkillItemSchema: import("mongoose").Schema<SkillItem, import("mongoose").Model<SkillItem, any, any, any, Document<unknown, any, SkillItem> & SkillItem & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SkillItem, Document<unknown, {}, import("mongoose").FlatRecord<SkillItem>> & import("mongoose").FlatRecord<SkillItem> & Required<{
    _id: unknown;
}>>;
export declare const LinkSchema: import("mongoose").Schema<SkillItem, import("mongoose").Model<SkillItem, any, any, any, Document<unknown, any, SkillItem> & SkillItem & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SkillItem, Document<unknown, {}, import("mongoose").FlatRecord<SkillItem>> & import("mongoose").FlatRecord<SkillItem> & Required<{
    _id: unknown;
}>>;
export declare const TextSchema: import("mongoose").Schema<SkillItem, import("mongoose").Model<SkillItem, any, any, any, Document<unknown, any, SkillItem> & SkillItem & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SkillItem, Document<unknown, {}, import("mongoose").FlatRecord<SkillItem>> & import("mongoose").FlatRecord<SkillItem> & Required<{
    _id: unknown;
}>>;
