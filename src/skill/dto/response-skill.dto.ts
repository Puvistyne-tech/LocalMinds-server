import {IsArray, IsBoolean, IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString,} from 'class-validator';
import {Skill, SkillType} from "../entities/skill.entity";
import {UserDto} from "../../user/dto/user.dto";
import {HydratedDocument} from "mongoose";
import {Expose, ExposeOptions, plainToInstance, Transform, Type} from "class-transformer";
import {ObjectId} from 'mongodb'
import {ApiProperty} from '@nestjs/swagger';

export class ResponseSkillDto {

    @ApiProperty({ 
        example: '507f1f77bcf86cd799439011', 
        description: 'Skill ID' 
    })
    @IsMongoId()
    @Expose()
    @TransformMongoId()
    _id: ObjectId;

    @ApiProperty({ 
        example: 'Web Development', 
        description: 'Title of the skill' 
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    title: string;

    @ApiProperty({ 
        example: { text: 'Experienced in React and Node.js' }, 
        description: 'Content of the skill post' 
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
        description: 'Tags associated with the skill' 
    })
    @IsArray()
    @IsOptional()
    @Expose()
    tags?: string[];

    @ApiProperty({ 
        example: 'Programming', 
        description: 'Category of the skill' 
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    category: string;

    @ApiProperty({ 
        enum: SkillType,
        example: SkillType.OFFER,
        description: 'Type of skill post (OFFER or REQUEST)' 
    })
    @IsEnum(SkillType)
    @IsNotEmpty()
    @Expose()
    type: SkillType;

    @ApiProperty({ 
        type: () => UserDto,
        description: 'User who created the skill' 
    })
    @IsNotEmpty()
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty({ 
        example: false, 
        description: 'Status of the skill',
        default: false 
    })
    @IsBoolean()
    @Expose()
    status: boolean = false;

    static from(skill: HydratedDocument<Skill>): ResponseSkillDto {
        return plainToInstance(ResponseSkillDto, skill, {
            excludeExtraneousValues: true
        });
    }

    static many(skills: Array<HydratedDocument<Skill>>) {
        return skills.map(skill => this.from(skill));
    }
}

export function TransformMongoId(options?: ExposeOptions) {
    return (target: any, propertyKey: string) => {
        Transform((params) => params.obj[propertyKey]?.toString(), options)(target, propertyKey)
    }
}
