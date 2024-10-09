import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../user/user.service';
import {CreateUserDto} from '../user/dto/create-user.dto';
import {AuthUserResDto} from '../user/dto/authUserResDto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UserService,
    ) {
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async signIn(
        username: string,
        pass: string,
    ): Promise<AuthUserResDto> {
        const user = await this.usersService.findOne(username);
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException();
        }
        const payload = {sub: user.id, username: user.username};
        return AuthUserResDto.from(user, await this.jwtService.signAsync(payload));
    }


    async signup(userDto: CreateUserDto) {
        // Create the user
        const user = await this.usersService.create(userDto);

        // Generate a JWT token for the new user
        const payload = {username: user.username, sub: user.id};
        const accessToken = this.jwtService.sign(payload);

        // Optional: Send a confirmation email (not implemented here)
        // await this.emailService.sendConfirmation(user.email);

        // Return the user details and the access token
        return AuthUserResDto.from(user, accessToken);
    }

    async getAllUsers() {
        return this.usersService.findAll();
    }
}
