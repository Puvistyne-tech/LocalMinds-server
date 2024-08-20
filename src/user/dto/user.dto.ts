import { User } from '../entities/user.entity';

export class UserDto {
  user: {
    id: string;
    username: string;
    email: string;
  };
  accessToken: string;

  constructor(user: User, accessToken: string) {
    this.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    this.accessToken = accessToken;
  }
}
