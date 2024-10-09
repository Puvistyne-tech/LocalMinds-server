import {SkillType} from "./entities/skill.entity";

enum Order {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING",
}

export class SkillFilter {
    query?: string;
    tags?: string;
    category?: string;
    type?: SkillType;
    date?: string;
    location?: string;
    page?: number;
    pageSize?: number;
    order?: string;
}