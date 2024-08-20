import { CreateSkillItemDto } from './create-skill-item.dto';
export declare class CreateSkillDto {
    name: string;
    description: string;
    date_created?: Date;
    date_modified?: Date;
    skillItems?: CreateSkillItemDto[];
    tags?: string[];
    category?: string;
}
