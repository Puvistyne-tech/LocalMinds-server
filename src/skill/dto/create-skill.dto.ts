import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateSkillItemDto } from './create-skill-item.dto';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsOptional()
  date_created?: Date;

  @IsDate()
  @IsOptional()
  date_modified?: Date;

  @IsArray()
  @IsOptional()
  skillItems?: CreateSkillItemDto[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;
}
