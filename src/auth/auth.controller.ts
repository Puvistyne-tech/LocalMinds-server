import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '../metadata';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
    AuthPayloadDTO,
    RefreshTokenDTO,
    ForgotPasswordDTO,
    ResetPasswordDTO,
} from './dto/auth.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ 
      status: 200, 
      description: 'Login successful',
      schema: {
        example: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    signIn(@Body() signInDto: AuthPayloadDTO) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Public()
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ 
      status: 200, 
      description: 'Token refresh successful',
      schema: {
        example: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    })
    refreshToken(@Body() refreshTokenDto: RefreshTokenDTO) {
        return this.authService.refreshToken(refreshTokenDto.refresh_token);
    }

    @Public()
    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ 
      status: 200, 
      description: 'Password reset email sent',
      schema: {
        example: {
          message: 'Password reset email sent'
        }
      }
    })
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Public()
    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password using token' })
    @ApiResponse({ 
      status: 200, 
      description: 'Password reset successful',
      schema: {
        example: {
          message: 'Password reset successful'
        }
      }
    })
    resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
        return this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.new_password
        );
    }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('signup')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ 
      status: 201, 
      description: 'User registration successful' 
    })
    @ApiResponse({ 
      status: 409, 
      description: 'Username or email already exists' 
    })
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ 
      status: 200, 
      description: 'Returns user profile' 
    })
    getProfile(@Request() request) {
        return request.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all users (Protected)' })
    @ApiResponse({ 
      status: 200, 
      description: 'Returns all users' 
    })
    findAllUsers() {
        return this.authService.getAllUsers();
    }
}
