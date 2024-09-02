import {IsArray, IsDate, IsOptional, IsString} from 'class-validator';
import {UpdateSkillItemDto} from "./update-skill-item.dto";

export class UpdateSkillDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDate()
    @IsOptional()
    date_created?: Date;

    @IsDate()
    @IsOptional()
    date_modified?: Date;

    @IsArray()
    @IsOptional()
    skill_items?: UpdateSkillItemDto[]; // You might want to define a more specific type here

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    category?: String;
}
