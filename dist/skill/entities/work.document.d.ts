import { SkillItem } from './skillTtem.entity';
export declare class Work extends SkillItem {
    name: string;
    description: string;
    location: string;
    time_slots: string[];
    date_created: Date;
    date_modified: Date;
}
export declare const WorkSchema: import("mongoose").Schema<SkillItem, import("mongoose").Model<SkillItem, any, any, any, import("mongoose").Document<unknown, any, SkillItem> & SkillItem & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SkillItem, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<SkillItem>> & import("mongoose").FlatRecord<SkillItem> & Required<{
    _id: unknown;
}>>;
