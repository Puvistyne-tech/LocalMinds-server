import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDto } from '../user/dto/user.dto';
export declare class AuthService {
    private jwtService;
    private usersService;
    constructor(jwtService: JwtService, usersService: UserService);
    validateUser(username: string, pass: string): Promise<any>;
    signIn(username: string, pass: string): Promise<{
        access_token: string;
    }>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    signup(userDto: CreateUserDto): Promise<UserDto>;
    getAllUsers(): Promise<import("../user/entities/user.entity").User[]>;
}
