import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDTO {
  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString()
  username: string;

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
    example: '123456abcdef', 
    description: 'Password reset token received via email' 
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
    example: '123456abcdef', 
    description: 'Email verification token' 
  })
  @IsString()
  token: string;
}
