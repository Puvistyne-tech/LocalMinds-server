import { User } from '../entities/user.entity';
export declare class UserDto {
    user: {
        id: string;
        username: string;
        email: string;
    };
    accessToken: string;
    constructor(user: User, accessToken: string);
}
