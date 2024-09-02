import {PartialType} from "@nestjs/mapped-types";
import {CreateSkillItemDto} from "./create-skill-item.dto";


// export class UpdateSkillItemDto {
//   @IsEnum(SkillItemType)
//   @IsOptional()
//   type?: SkillItemType;
//
//   @IsString()
//   @IsOptional()
//   content?: string;
//
//   @IsString()
//   @IsOptional()
//   name?: string;
//
//   @IsString()
//   @IsOptional()
//   link?: string;
//
//   @IsString()
//   @IsOptional()
//   description?: string;
//
//   @IsString()
//   @IsOptional()
//   order?: number;
// }


export class UpdateSkillItemDto extends PartialType(CreateSkillItemDto) {
}