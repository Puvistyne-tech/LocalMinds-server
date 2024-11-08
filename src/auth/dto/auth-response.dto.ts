import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
    id: string;

    @ApiProperty({ example: 'johndoe', description: 'Username' })
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    email: string;

    @ApiProperty({ example: ['user'], description: 'User roles' })
    roles: string[];

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Account creation date' })
    created_at: Date;

    @ApiProperty({ example: false, description: 'Email verification status' })
    is_verified: boolean;

    @ApiProperty({ 
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
        description: 'JWT access token' 
    })
    access_token: string;

    @ApiProperty({ 
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
        description: 'JWT refresh token' 
    })
    refresh_token: string;

    @ApiProperty({ example: 900, description: 'Token expiration time in seconds' })
    expires_in: number;
} 