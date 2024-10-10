import {IsArray, IsBoolean, IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString,} from 'class-validator';
import {Skill, SkillType} from "../entities/skill.entity";
import {UserDto} from "../../user/dto/user.dto";
import {HydratedDocument} from "mongoose";
import {Expose, ExposeOptions, plainToInstance, Transform, Type} from "class-transformer";
import {ObjectId} from 'mongodb'

export class ResponseSkillDto {

    // constructor(skill: Require_id<Skill>) {
    //     this._id = skill._id.toString();
    //     this.content = skill.content;
    //     this.category = skill.category;
    //     this.date_created = skill.date_created;
    //     this.date_modified = skill.date_modified;
    //     this.tags = skill.tags;
    //     this.type = skill.type;
    //     // this.user = new UserDto(skill.user);
    //     this.user = UserDto.createUserDtoFromUser(skill.user);
    //     this.status = skill.status;
    // }

    @IsMongoId()
    @Expose()
    @TransformMongoId()
    _id: ObjectId;

    @IsString()
    @IsNotEmpty()
    @Expose()
    title: string;

    @IsNotEmpty()
    @Expose()
    content: any;

    @IsDate()
    @IsOptional()
    @Expose()
    date_created?: Date;

    @IsDate()
    @IsOptional()
    @Expose()
    date_modified?: Date;

    @IsArray()
    @IsOptional()
    @Expose()
    tags?: string[];

    @IsString()
    @IsNotEmpty()
    @Expose()
    category: string;

    @IsEnum(SkillType) // Add validation for skill_type using the SkillType enum
    @IsNotEmpty()
    @Expose()
    type: SkillType;

    @IsNotEmpty()
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @IsBoolean()
    @Expose()
    status: boolean = false; // Opti

    static many(skills: Array<HydratedDocument<Skill, {}, {}>>) {
        const skillsDtos: Array<ResponseSkillDto> = [];
        skills.forEach(skill => skillsDtos.push(plainToInstance(
                ResponseSkillDto,
                skill,
                {
                    excludeExtraneousValues: true
                }
            )
        ));
        return skillsDtos;
    }
}

export function TransformMongoId(options?: ExposeOptions) {
    return (target: any, propertyKey: string) => {
        Transform((params) => params.obj[propertyKey]?.toString(), options)(target, propertyKey)
    }
}
