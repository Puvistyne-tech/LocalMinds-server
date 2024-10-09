import {IsString, IsEmail} from 'class-validator';
import {User} from '../entities/user.entity';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsEmail()
    email: string;

    @IsString()
    phone: string;

}
