import {
    Body,
    Controller,
    Get, HttpCode, HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';
import {JwtAuthGuard} from './jwt-auth.guard';
import {Public} from '../metadata';
import {CreateUserDto} from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }


    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        // console.log(signInDto);
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    // @UseGuards(LocalAuthGuard)
    // @Post('signin')
    // async login(@Request() req) {
    //     console.log(req.user);
    //     return this.authService.login(req.user);
    // }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() request) {
        return request.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
    findAllUsers() {
        return this.authService.getAllUsers();
    }
}
