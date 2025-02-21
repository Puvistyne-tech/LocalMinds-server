import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ 
        example: 'Programming', 
        description: 'Name of the category' 
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        example: ['Web Development', 'Mobile Development'], 
        description: 'List of subcategories',
        required: false 
    })
    @IsArray()
    @IsOptional()
    subcategories?: string[];

    @ApiProperty({ 
        example: 'https://example.com/icon.png', 
        description: 'Icon URL of the category',
        required: false 
    })
    @IsString()
    @IsOptional()
    icon?: string;
}
