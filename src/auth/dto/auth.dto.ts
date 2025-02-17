import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDTO {
  @ApiProperty({ 
    example: 'johndoe', 
    description: 'Username or email address' 
  })
  @IsString()
  identifier: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'User password - minimum 6 characters' 
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
    description: 'Refresh token' 
  })
  @IsString()
  refresh_token: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'User email address' 
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ 
    example: 'a1b2c3d4...', 
    description: 'Password reset token from the reset link' 
  })
  @IsString()
  token: string;

  @ApiProperty({ 
    example: 'newpassword123', 
    description: 'New password - minimum 6 characters' 
  })
  @IsString()
  @MinLength(6)
  new_password: string;
}

export class VerifyEmailDTO {
  @ApiProperty({ 
    example: 'abc123...', 
    description: 'Email verification token from the verification link'
  })
  @IsString()
  token: string;
}

export class ResendVerificationDTO {
  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'Email address to resend verification link to' 
  })
  @IsEmail()
  email: string;
}

export class UpdateProfileDTO {
    @ApiProperty({ example: 'johndoe', description: 'New username', required: false })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({ example: 'john@example.com', description: 'New email', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'currentpassword123', description: 'Current password (required for email/username change)' })
    @IsString()
    @IsOptional()
    current_password?: string;

    @ApiProperty({ example: 'John', description: 'First name', required: false })
    @IsString()
    @IsOptional()
    firstname?: string;

    @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
    @IsString()
    @IsOptional()
    lastname?: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'Full stack developer...', description: 'Bio', required: false })
    @IsString()
    @IsOptional()
    bio?: string;
}

export class ConfirmEmailChangeDTO {
    @ApiProperty({ description: 'Email change confirmation token' })
    @IsString()
    token: string;
}
