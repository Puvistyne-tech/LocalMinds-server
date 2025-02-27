import {IsArray, IsBoolean, IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString,} from 'class-validator';
import {Post, PostType} from "../entities/post.entity";
import {UserDto} from "../../user/dto/user.dto";
import {HydratedDocument} from "mongoose";
import {Expose, ExposeOptions, plainToInstance, Transform, Type} from "class-transformer";
import {ObjectId} from 'mongodb'
import {ApiProperty} from '@nestjs/swagger';

export class ResponsePostDto {

    @ApiProperty({ 
        example: '507f1f77bcf86cd799439011', 
        description: 'Post ID' 
    })
    @IsMongoId()
    @Expose()
    @TransformMongoId()
    _id: ObjectId;

    @ApiProperty({ 
        example: 'Web Development', 
        description: 'Title of the post' 
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    title: string;

    @ApiProperty({ 
        example: { text: 'Experienced in React and Node.js' }, 
        description: 'Content of the post' 
    })
    @IsNotEmpty()
    @Expose()
    content: any;

    @ApiProperty({ 
        example: '2024-01-01T00:00:00.000Z', 
        description: 'Creation date' 
    })
    @IsDate()
    @IsOptional()
    @Expose()
    date_created?: Date;

    @ApiProperty({ 
        example: '2024-01-01T00:00:00.000Z', 
        description: 'Last modification date' 
    })
    @IsDate()
    @IsOptional()
    @Expose()
    date_modified?: Date;

    @ApiProperty({ 
        example: ['javascript', 'react'], 
        description: 'Tags associated with the post' 
    })
    @IsArray()
    @IsOptional()
    @Expose()
    tags?: string[];

    @ApiProperty({ 
        example: 'Programming', 
        description: 'Category of the post' 
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    category: string;

    @ApiProperty({ 
        enum: PostType,
        example: PostType.OFFER,
        description: 'Type of post (OFFER or REQUEST)' 
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    @Expose()
    type: PostType;

    @ApiProperty({ 
        type: () => UserDto,
        description: 'User who created the post' 
    })
    @IsNotEmpty()
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty({ 
        example: false, 
        description: 'Status of the post',
        default: false 
    })
    @IsBoolean()
    @Expose()
    status: boolean = false;

    static from(post: HydratedDocument<Post>): ResponsePostDto {
        return plainToInstance(ResponsePostDto, post, {
            excludeExtraneousValues: true
        });
    }

    static many(posts: Array<HydratedDocument<Post>>) {
        return posts.map(post => this.from(post));
    }
}

export function TransformMongoId(options?: ExposeOptions) {
    return (target: any, propertyKey: string) => {
        Transform((params) => params.obj[propertyKey]?.toString(), options)(target, propertyKey)
    }
}
