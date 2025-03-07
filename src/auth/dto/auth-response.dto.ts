import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
    id: string;

    @ApiProperty({ example: 'johndoe', description: 'Username' })
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    email: string;

    @ApiProperty({ example: 'John', description: 'First name', required: false })
    firstname?: string;

    @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
    lastname?: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    phone: string;

    @ApiProperty({ example: 'Full stack developer...', description: 'User bio', required: false })
    bio?: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL', required: false })
    avatar?: string;

    @ApiProperty({ example: true, description: 'Email verification status' })
    email_verified: boolean;

    @ApiProperty({ example: true, description: 'Account active status' })
    is_active: boolean;

    @ApiProperty({ example: true, description: 'Phone verification status' })
    phone_verified: boolean;

    @ApiProperty({ example: ['user'], description: 'User roles' })
    roles: string[];

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Account creation date' })
    created_at: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last modification date' })
    modified_at: Date;

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

export class VerificationResponseDto {
    @ApiProperty({ 
        example: 'Email verified successfully', 
        description: 'Status message' 
    })
    message: string;

    @ApiProperty({ 
        example: true, 
        description: 'Verification status' 
    })
    email_verified: boolean;
}

export class ResendVerificationResponseDto {
    @ApiProperty({ 
        example: 'Verification email sent successfully', 
        description: 'Status message' 
    })
    message: string;

    @ApiProperty({ 
        example: 'john@example.com', 
        description: 'Email address' 
    })
    email: string;
}

export class ProfileResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
    id: string;

    @ApiProperty({ example: 'johndoe', description: 'Username' })
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    email: string;

    @ApiProperty({ example: 'John', description: 'First name', required: false })
    firstname?: string;

    @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
    lastname?: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    phone: string;

    @ApiProperty({ example: 'Full stack developer...', description: 'User bio', required: false })
    bio?: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL', required: false })
    avatar?: string;

    @ApiProperty({ example: true, description: 'Email verification status' })
    email_verified: boolean;

    @ApiProperty({ example: true, description: 'Account active status' })
    is_active: boolean;

    @ApiProperty({ example: true, description: 'Phone verification status' })
    phone_verified: boolean;

    @ApiProperty({ example: ['user'], description: 'User roles' })
    roles: string[];

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Account creation date' })
    created_at: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last modification date' })
    modified_at: Date;
}

export class EmailChangeInitiatedResponseDto {
    @ApiProperty({ 
        example: 'Email change initiated. Please check your old and new email addresses for confirmation.',
        description: 'Status message'
    })
    message: string;

    @ApiProperty({ 
        example: 'john@example.com',
        description: 'Current email address'
    })
    current_email: string;

    @ApiProperty({ 
        example: 'newjohn@example.com',
        description: 'New email address'
    })
    new_email: string;
}

export class UsernameChangeResponseDto {
    @ApiProperty({ 
        example: 'Username updated successfully',
        description: 'Status message'
    })
    message: string;

    @ApiProperty({ 
        example: 2,
        description: 'Remaining username changes allowed'
    })
    remaining_changes: number;
} 