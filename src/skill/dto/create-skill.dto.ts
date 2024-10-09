import {IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString,} from 'class-validator';
import {SkillType} from "../entities/skill.entity";

export class CreateSkillDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: any;

    // @IsDate()
    // @IsOptional()
    // date_created?: Date;

    // @IsDate()
    // @IsOptional()
    // date_modified?: Date = new Date();

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsEnum(SkillType) // Add validation for skill_type using the SkillType enum
    @IsNotEmpty()
    type: SkillType;

    @IsNotEmpty()
    @IsString()
    userId: String; // Optional field to associate the skill with a user (if applicable)

    @IsNotEmpty()
    @IsBoolean()
    status: boolean = false; // Opti
}
