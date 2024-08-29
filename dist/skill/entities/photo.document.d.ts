import { SkillItem } from './skillTtem.entity';
export declare class Photo extends SkillItem {
    content: string;
    name: string;
}
export declare const PhotoSchema: import("mongoose").Schema<SkillItem, import("mongoose").Model<SkillItem, any, any, any, import("mongoose").Document<unknown, any, SkillItem> & SkillItem & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SkillItem, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<SkillItem>> & import("mongoose").FlatRecord<SkillItem> & Required<{
    _id: unknown;
}>>;
