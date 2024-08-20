import { SkillItemType } from '../entities/skillTtem.entity';
export declare class UpdateSkillItemDto {
    type?: SkillItemType;
    content?: string;
    name?: string;
    link?: string;
    description?: string;
    order?: number;
}
