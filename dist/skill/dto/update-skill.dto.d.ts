import { Types } from "mongoose";
export declare class UpdateSkillDto {
    name?: string;
    description?: string;
    date_created?: Date;
    date_modified?: Date;
    skill_items?: any[];
    tags?: string[];
    category?: Types.ObjectId;
}
