import {IsArray, IsDate, IsOptional, IsString} from 'class-validator';
import {Types} from "mongoose";

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
    skill_items?: any[]; // You might want to define a more specific type here

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    category?: Types.ObjectId;
}
