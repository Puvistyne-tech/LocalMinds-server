import {User} from '../entities/user.entity';

export class UserDto {
    user: {
        id: string;
        username: string;
        email: string;
        phone: string;
        avatar: string;
        created_at: Date;
    };
    accessToken: string;

    constructor(user: User, accessToken: string) {
        this.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            created_at: user.created_at,
        };
        this.accessToken = accessToken;
    }
}
