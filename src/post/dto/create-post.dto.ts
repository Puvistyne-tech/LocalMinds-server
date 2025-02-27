import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostType } from '../entities/post.entity';

export class CreatePostDto {
    @ApiProperty({ example: 'Web Development', description: 'Title of the post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ 
        example: { text: 'Experienced in React and Node.js' }, 
        description: 'Content of the post' 
    })
    @IsNotEmpty()
    content: any;

    @ApiProperty({ 
        example: ['javascript', 'react'], 
        description: 'Tags associated with the post',
        required: false 
    })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ 
        example: 'Programming', 
        description: 'Category of the post' 
    })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ 
        enum: PostType,
        example: PostType.OFFER,
        description: 'Type of post (OFFER or REQUEST)' 
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    type: PostType;

    @ApiProperty({ 
        example: false, 
        description: 'Status of the post',
        required: false 
    })
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
