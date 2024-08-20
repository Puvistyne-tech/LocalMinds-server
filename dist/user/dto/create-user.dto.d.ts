import { User } from '../entities/user.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    email: string;
    phone: string;
    toUser(): User;
}
