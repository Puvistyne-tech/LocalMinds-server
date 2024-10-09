import {User} from '../entities/user.entity';
import {UserDto} from "./user.dto";
import {Expose, plainToInstance, Type} from "class-transformer";

export class AuthUserResDto {

    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    accessToken: string;

    static from(user, accessToken: string): AuthUserResDto {
        return plainToInstance(
            AuthUserResDto,
            {
                user: user.toObject(),
                accessToken: accessToken,
            },
            {excludeExtraneousValues: true}
        );
    }
}

