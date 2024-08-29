import {IsEnum, IsNotEmpty, IsNumber} from 'class-validator';
import {SkillItemType} from '../entities/skillTtem.entity';

export class CreateSkillItemDto {
    @IsNumber()
    @IsNotEmpty()
    order: number;

    @IsEnum(SkillItemType)
    @IsNotEmpty()
    type: SkillItemType;

    [key: string]: any; // Allows additional properties specific to each SkillItem type

}
