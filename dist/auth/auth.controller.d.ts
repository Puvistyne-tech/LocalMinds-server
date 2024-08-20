import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    signup(createUserDto: CreateUserDto): Promise<import("../user/dto/user.dto").UserDto>;
    getProfile(request: any): any;
    findAllUsers(): Promise<import("../user/entities/user.entity").User[]>;
}
