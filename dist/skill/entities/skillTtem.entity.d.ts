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
