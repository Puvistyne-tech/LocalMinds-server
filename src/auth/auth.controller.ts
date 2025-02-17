import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    UseGuards,
    Put,
    Request,
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
    VerifyEmailDTO,
    ResendVerificationDTO,
    UpdateProfileDTO,
    ConfirmEmailChangeDTO,
} from './dto/auth.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
} from '@nestjs/swagger';
import { 
    SignInResponseDto, 
    VerificationResponseDto,
    ProfileResponseDto,
    ResendVerificationResponseDto 
} from './dto/auth-response.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ 
        summary: 'User login', 
        description: 'Login with email or username'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Login successful',
        type: SignInResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    signIn(@Body() signInDto: AuthPayloadDTO) {
        return this.authService.signIn(signInDto.identifier, signInDto.password);
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
        description: 'Returns complete user profile information',
        type: ProfileResponseDto
    })
    @ApiResponse({ 
        status: 404, 
        description: 'User not found' 
    })
    getProfile(@Req() req) {
        return this.authService.getProfile(req.user.userId);
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

    @Public()
    @Post('verify-email')
    @ApiOperation({ 
        summary: 'Verify email using verification token',
        description: 'Verifies email using token from verification link'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Email verified successfully',
        type: VerificationResponseDto
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Invalid or expired verification token',
        schema: {
            example: {
                message: 'Verification token has expired',
                code: 'TOKEN_EXPIRED',
                email: 'john@example.com'
            }
        }
    })
    verifyEmail(@Body() verifyEmailDto: VerifyEmailDTO) {
        return this.authService.verifyEmail(verifyEmailDto.token);
    }

    @Public()
    @Post('resend-verification')
    @ApiOperation({ summary: 'Resend verification email' })
    @ApiResponse({ 
        status: 200, 
        description: 'Verification email sent successfully',
        type: ResendVerificationResponseDto
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Bad request - email not found or already verified' 
    })
    @ApiResponse({ 
        status: 429, 
        description: 'Too many requests - please wait before trying again' 
    })
    resendVerificationEmail(@Body() resendDto: ResendVerificationDTO) {
        return this.authService.resendVerificationEmail(resendDto.email);
    }

    @Public()
    @Get('check-email')
    @ApiOperation({ summary: 'Check if email exists' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns true if email exists, false otherwise',
        schema: {
            example: {
                exists: true
            }
        }
    })
    checkEmailExists(@Query('email') email: string) {
        return this.authService.checkEmailExists(email).then(exists => ({ exists }));
    }

    @Public()
    @Get('check-username')
    @ApiOperation({ summary: 'Check if username exists' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns true if username exists, false otherwise',
        schema: {
            example: {
                exists: true
            }
        }
    })
    checkUsernameExists(@Query('username') username: string) {
        return this.authService.checkUsernameExists(username).then(exists => ({ exists }));
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({ 
        status: 200, 
        description: 'Profile updated successfully' 
    })
    updateProfile(
        @Request() req,
        @Body() updateProfileDto: UpdateProfileDTO
    ) {
        return this.authService.updateProfile(req.user.userId, updateProfileDto);
    }

    @Public()
    @Post('confirm-email-change')
    @ApiOperation({ summary: 'Confirm email change' })
    @ApiResponse({ 
        status: 200, 
        description: 'Email change confirmed' 
    })
    confirmEmailChange(@Body() confirmDto: ConfirmEmailChangeDTO) {
        return this.authService.confirmEmailChange(confirmDto.token);
    }
}
