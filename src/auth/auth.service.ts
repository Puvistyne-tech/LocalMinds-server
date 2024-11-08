import {Injectable, UnauthorizedException, BadRequestException, ConflictException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../user/user.service';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Token} from './entities/token.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {MailerService} from '@nestjs-modules/mailer';
import {CreateUserDto} from '../user/dto/create-user.dto';
import {AuthUserResDto} from '../user/dto/authUserResDto';
import { User } from '../user/entities/user.entity';
import { RateLimiterService } from '../shared/rate-limiter.service';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UserService,
        private mailerService: MailerService,
        private configService: ConfigService,
        private rateLimiterService: RateLimiterService,
        @InjectModel(Token.name) private tokenModel: Model<Token>,
    ) {
    }

    async signIn(username: string, pass: string) {
        await this.rateLimiterService.checkRateLimit(`login_${username}`);

        const user = await this.usersService.findOne(username);
        if (!user) {
            await bcrypt.compare(pass, '$2b$10$invalidhashforusername');
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: string, refreshToken: string) {
        await this.tokenModel.findOneAndUpdate(
            { user: userId, refresh_token: refreshToken },
            { is_revoked: true }
        );
        return { message: 'Logged out successfully' };
    }

    async logoutAll(userId: string) {
        await this.tokenModel.updateMany(
            { user: userId },
            { is_revoked: true }
        );
        return { message: 'Logged out from all devices' };
    }

    private async generateTokens(user: User) {
        const payload = {
            sub: user._id.toString(),
            username: user.username,
            roles: user.roles
        };
        
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m',
                secret: jwtSecret
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: refreshSecret
            })
        ]);

        return {
            access_token,
            refresh_token,
            expires_in: 900 // 15 minutes in seconds
        };
    }

    private async saveRefreshToken(user: User, refresh_token: string) {
        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + 7);

        try {
            await this.tokenModel.create({
                user: user._id,
                refresh_token,
                expires_at,
            });
        } catch (error) {
            console.error('Error saving refresh token:', error);
        }
    }

    async refreshToken(refresh_token: string) {
        const token = await this.tokenModel.findOne({
            refresh_token,
            is_revoked: false,
            expires_at: { $gt: new Date() }
        }).populate<{ user: User }>('user').exec();

        if (!token || !token.user) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = token.user as User;
        const tokens = await this.generateTokens(user);
        
        // Revoke old refresh token
        await this.tokenModel.findByIdAndUpdate(token.id, {is_revoked: true});
        
        // Save new refresh token
        await this.saveRefreshToken(user, tokens.refresh_token);

        return tokens;
    }

    async forgotPassword(email: string) {
        await this.rateLimiterService.checkRateLimit(`forgot_password_${email}`);

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const resetCode = this.generateVerificationCode();
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        user.reset_password_token = resetCode;
        user.reset_password_expires = expires;
        await user.save();

        await this.sendPasswordResetEmail(user, resetCode);

        return { message: 'Password reset code sent to your email' };
    }

    async resetPassword(token: string, new_password: string) {
        this.validatePassword(new_password);

        const user = await this.usersService.findByResetToken(token);
        if (!user || user.reset_password_expires < new Date()) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        // Revoke all refresh tokens for this user
        await this.tokenModel.updateMany(
            {user: user.id},
            {is_revoked: true}
        );

        return {message: 'Password reset successful'};
    }

    private validatePassword(password: string) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (
            password.length < minLength ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasNumbers ||
            !hasSpecialChar
        ) {
            throw new BadRequestException(
                'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
            );
        }
    }

    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async signup(userDto: CreateUserDto) {
        // Rate limiting for signup attempts from the same IP
        await this.rateLimiterService.checkRateLimit(`signup_${userDto.email}`);

        // Validate email format
        if (!isEmail(userDto.email)) {
            throw new BadRequestException('Invalid email format');
        }

        // Validate password
        this.validatePassword(userDto.password);

        // Check if username contains invalid characters
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(userDto.username)) {
            throw new BadRequestException(
                'Username must be 3-20 characters long and can only contain letters, numbers, underscores, and hyphens'
            );
        }

        // Check for existing user with same email or username
        const [existingEmail, existingUsername] = await Promise.all([
            this.usersService.findByEmail(userDto.email),
            this.usersService.findOne(userDto.username)
        ]);

        if (existingEmail) {
            // Use vague message for security
            throw new ConflictException('Email already registered');
        }

        if (existingUsername) {
            throw new ConflictException('Username already taken');
        }

        try {
            // Hash password before creating user
            const hashedPassword = await bcrypt.hash(userDto.password, 10);
            
            // Create user with default role
            const user = await this.usersService.create({
                ...userDto,
                password: hashedPassword,
                is_verified: false,
                created_at: new Date(),
                last_login: new Date()
            });

            user.roles = ['user'];
            
            // Generate 6-digit verification code
            const verificationCode = this.generateVerificationCode();
            const verificationExpires = new Date();
            verificationExpires.setHours(verificationExpires.getHours() + 24);

            user.verification_token = verificationCode;
            user.verification_expires = verificationExpires;
            await user.save();

            // Generate tokens
            const tokens = await this.generateTokens(user);
            await this.saveRefreshToken(user, tokens.refresh_token);

            // Send verification code via email
            await this.sendVerificationEmail(user, verificationCode);

            // Return user details (excluding sensitive information)
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                created_at: user.created_at,
                is_verified: user.is_verified,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_in: tokens.expires_in
            };
        } catch (error) {
            // Log the error (implement proper logging)
            console.error('Signup error:', error);
            
            if (error.code === 11000) { // MongoDB duplicate key error
                throw new ConflictException('User already exists');
            }
            
            throw new BadRequestException('Could not create user');
        }
    }

    private async sendVerificationEmail(user: User, token: string) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Verify Your Email',
                text: `
Hello ${user.username},

Thank you for registering! Here is your verification code:

${token}

This code will expire in 24 hours.

If you did not create an account, please ignore this email.
                `,
            });
        } catch (error) {
            console.error('Email sending error:', error);
        }
    }

    private async sendPasswordResetEmail(user: User, token: string) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Reset Your Password',
                text: `
Hello ${user.username},

You have requested to reset your password. Here is your reset code:

${token}

This code will expire in 1 hour.

If you did not request a password reset, please ignore this email.
                `,
            });
        } catch (error) {
            console.error('Email sending error:', error);
        }
    }

    // Add this new method for email verification
    async verifyEmail(token: string) {
        const user = await this.usersService.findByVerificationToken(token);
        
        if (!user) {
            throw new BadRequestException('Invalid verification token');
        }

        if (user.verification_expires < new Date()) {
            throw new BadRequestException('Verification token has expired');
        }

        if (user.is_verified) {
            throw new BadRequestException('Email already verified');
        }

        user.is_verified = true;
        user.verification_token = null;
        user.verification_expires = null;
        await user.save();

        return { message: 'Email verified successfully' };
    }

    async getAllUsers() {
        return this.usersService.findAll();
    }
}
