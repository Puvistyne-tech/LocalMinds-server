import {IsArray, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    subcategories?: string[];
}
