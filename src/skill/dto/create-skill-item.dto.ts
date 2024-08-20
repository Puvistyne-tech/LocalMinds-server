import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { SkillItemType } from '../entities/skillTtem.entity';

export class CreateSkillItemDto {
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsEnum(SkillItemType)
  @IsNotEmpty()
  type: SkillItemType;

  // @IsString()
  // @IsOptional()
  // text?: string;
  //
  // @IsString()
  // @IsOptional()
  // name?: string;
  //
  // @IsString()
  // @IsOptional()
  // location?: string;

  [key: string]: any; // Allows additional properties specific to each SkillItem type

  // @IsString()
  // @IsOptional()
  // time_slots?: string[];
  //
  // @IsString()
  // @IsOptional()
  // content?: string;
  //
  // @IsString()
  // @IsOptional()
  // link?: string;
  //
  // @IsString()
  // @IsOptional()
  // description?: string;
}
