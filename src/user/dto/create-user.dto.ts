import { IsString, IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  toUser(): User {
    const u = new User();
    u.username = this.username;
    u.email = this.email;
    u.password = this.password;
    u.phone = this.phone;
    return u;
  }
}
