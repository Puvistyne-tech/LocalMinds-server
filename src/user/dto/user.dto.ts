import {Expose, ExposeOptions, plainToInstance, Transform} from 'class-transformer';
import {User} from "../entities/user.entity";
import {IsBoolean, IsDate, IsEmail, IsMongoId, IsString} from "class-validator";
import {HydratedDocument} from "mongoose";
import {ObjectId} from "mongodb";

export class UserDto {
    @IsMongoId()
    @Expose()
    @TransformMongoId()
    _id: ObjectId;

    @IsString()
    @Expose()
    username: string;

    @IsEmail()
    @Expose()
    email: string;

    @IsString()
    @Expose()
    phone: string;

    @IsString()
    @Expose()
    avatar?: string;

    @IsDate()
    @Expose()
    created_at: Date;

    @IsBoolean()
    @Expose()
    email_verified?: boolean;

    @IsBoolean()
    @Expose()
    is_active?: boolean;

    // constructor(user: User) {
    //     this._id = user._id;  // Ensure ObjectId is converted to string
    //     this.username = user.username;
    //     this.email = user.email;
    //     this.phone = user.phone;
    //     this.avatar = user.avatar;
    //     this.created_at = user.created_at;
    //     this.is_verified = user.isVerified;
    //     this.is_active = true;
    // }

    static many(users: Array<HydratedDocument<User, {}, {}>>) {
        return users.map(user => plainToInstance(UserDto, user, {excludeExtraneousValues: true}));
    }

}

export function TransformMongoId(options?: ExposeOptions) {
    return (target: any, propertyKey: string) => {
        Transform((params) => params.obj[propertyKey]?.toString(), options)(target, propertyKey)
    }
}
