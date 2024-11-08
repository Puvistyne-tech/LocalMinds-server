import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SkillType } from '../entities/skill.entity';

export class CreateSkillDto {
    @ApiProperty({ example: 'Web Development', description: 'Title of the skill' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ 
        example: { text: 'Experienced in React and Node.js' }, 
        description: 'Content of the skill post' 
    })
    @IsNotEmpty()
    content: any;

    @ApiProperty({ 
        example: ['javascript', 'react'], 
        description: 'Tags associated with the skill',
        required: false 
    })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ 
        example: 'Programming', 
        description: 'Category of the skill' 
    })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ 
        enum: SkillType,
        example: SkillType.OFFER,
        description: 'Type of skill post (OFFER or REQUEST)' 
    })
    @IsEnum(SkillType)
    @IsNotEmpty()
    type: SkillType;

    @ApiProperty({ 
        example: false, 
        description: 'Status of the skill',
        required: false 
    })
    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsNotEmpty()
    @IsString()
    userId: String; 
}
