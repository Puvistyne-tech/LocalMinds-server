import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SkillItemType } from '../entities/skillTtem.entity';


export class UpdateSkillItemDto {
  @IsEnum(SkillItemType)
  @IsOptional()
  type?: SkillItemType;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  order?: number;
}
