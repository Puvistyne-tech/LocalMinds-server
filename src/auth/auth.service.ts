import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token } from "./entities/token.entity";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { MailerService } from "@nestjs-modules/mailer";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthUserResDto } from "../user/dto/authUserResDto";
import { User } from "../user/entities/user.entity";
import { RateLimiterService } from "../shared/rate-limiter.service";
import { ConfigService } from "@nestjs/config";
import { isEmail } from "class-validator";
import { UpdateProfileDTO } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private rateLimiterService: RateLimiterService,
    @InjectModel(Token.name) private tokenModel: Model<Token>
  ) {}

  async signIn(identifier: string, pass: string) {
    try {
      // Check rate limiting first
      //await this.rateLimiterService.checkRateLimit(`login_${identifier}`);

      // Validate input
      if (!identifier || !pass) {
        throw new BadRequestException({
          statusCode: 400,
          message: "Missing credentials",
          error: "BAD_REQUEST",
          details: {
            identifier: !identifier ? "Email or username is required" : undefined,
            password: !pass ? "Password is required" : undefined
          }
        });
      }

      // Try to find user by username or email
      const user = await this.usersService.findByIdentifier(identifier);

      // If user not found, do a dummy compare to prevent timing attacks
      if (!user) {
        await bcrypt.compare(pass, "$2b$10$invalidhashforusername");
        throw new UnauthorizedException({
          statusCode: 401,
          message: "Invalid credentials",
          error: "INVALID_CREDENTIALS"
        });
      }

      // Check if user is active
      if (!user.is_active) {
        throw new ForbiddenException({
          statusCode: 403,
          message: "Account is deactivated",
          error: "ACCOUNT_DEACTIVATED"
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: "Invalid credentials",
          error: "INVALID_CREDENTIALS"
        });
      }

      // Check email verification
      if (!user.is_verified) {
        throw new ForbiddenException({
          statusCode: 403,
          message: "Email not verified",
          error: "EMAIL_NOT_VERIFIED",
          details: {
            email: user.email,
            canResendVerification: true
          }
        });
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);
      await this.saveRefreshToken(user, tokens.refresh_token);

      // Return success response with user data and tokens
      return {
        statusCode: 200,
        message: "Login successful",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
          is_verified: user.is_verified,
          is_active: user.is_active,
          is_email_verified: user.is_email_verified,
          roles: user.roles,
          created_at: user.created_at,
          modified_at: user.modified_at,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
        }
      };
    } catch (error) {
      // Handle rate limit errors
      if (error.message?.includes('Too Many Requests')) {
        throw new ForbiddenException({
          statusCode: 429,
          message: "Too many login attempts",
          error: "RATE_LIMIT_EXCEEDED",
          details: {
            retryAfter: error.getResponse?.()?.retryAfter || 60
          }
        });
      }
      
      // Re-throw known errors
      if (error instanceof UnauthorizedException || 
          error instanceof BadRequestException || 
          error instanceof ForbiddenException) {
        throw error;
      }

      // Log unexpected errors and throw a generic error
      console.error('Login error:', error);
      throw new UnauthorizedException({
        statusCode: 500,
        message: "An unexpected error occurred",
        error: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  async logout(userId: string, refreshToken: string) {
    await this.tokenModel.findOneAndUpdate(
      { user: userId, refresh_token: refreshToken },
      { is_revoked: true }
    );
    return { message: "Logged out successfully" };
  }

  async logoutAll(userId: string) {
    await this.tokenModel.updateMany({ user: userId }, { is_revoked: true });
    return { message: "Logged out from all devices" };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
      roles: user.roles,
    };

    const jwtSecret = this.configService.get<string>("JWT_SECRET");
    const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET");

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: "15m",
        secret: jwtSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: "7d",
        secret: refreshSecret,
      }),
    ]);

    return {
      access_token,
      refresh_token,
      expires_in: 900, // 15 minutes in seconds
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
      console.error("Error saving refresh token:", error);
    }
  }

  async refreshToken(refresh_token: string) {
    const token = await this.tokenModel
      .findOne({
        refresh_token,
        is_revoked: false,
        expires_at: { $gt: new Date() },
      })
      .populate<{ user: User }>("user")
      .exec();

    if (!token || !token.user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = token.user as User;
    const tokens = await this.generateTokens(user);

    // Revoke old refresh token
    await this.tokenModel.findByIdAndUpdate(token.id, { is_revoked: true });

    // Save new refresh token
    await this.saveRefreshToken(user, tokens.refresh_token);

    return tokens;
  }

  async forgotPassword(email: string) {
    await this.rateLimiterService.checkRateLimit(`forgot_password_${email}`);

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    user.reset_password_token = resetToken;
    user.reset_password_expires = expires;
    await user.save();

    await this.sendPasswordResetEmail(user, resetToken);

    return { message: "Password reset link sent to your email" };
  }

  async resetPassword(token: string, new_password: string) {
    this.validatePassword(new_password);

    const user = await this.usersService.findByResetToken(token);
    if (!user || user.reset_password_expires < new Date()) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    // Revoke all refresh tokens for this user
    await this.tokenModel.updateMany({ user: user.id }, { is_revoked: true });

    return { message: "Password reset successful" };
  }

  private validatePassword(password: string) {
    const minLength = 8;
    // More permissive special character set including those used by Apple
    const hasSpecialChar = /[-.,+=^!/*?&@#$%()"\[\]{}|~<>;:_]/.test(password);

    // Only check length and ensure it has at least 2 of: uppercase, lowercase, numbers, special chars
    let conditionsMet = 0;
    if (/[A-Z]/.test(password)) conditionsMet++;
    if (/[a-z]/.test(password)) conditionsMet++;
    if (/\d/.test(password)) conditionsMet++;
    if (hasSpecialChar) conditionsMet++;

    if (password.length < minLength || conditionsMet < 2) {
      throw new BadRequestException(
        "Password must be at least 8 characters long and contain at least 2 of the following: uppercase, lowercase, numbers, or special characters"
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
      throw new BadRequestException("Invalid email format");
    }

    // Validate password
    this.validatePassword(userDto.password);

    // Check if username contains invalid characters
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(userDto.username)) {
      throw new BadRequestException(
        "Username must be 3-20 characters long and can only contain letters, numbers, underscores, and hyphens"
      );
    }

    // Check for existing user with same email or username
    const [existingEmail, existingUsername] = await Promise.all([
      this.usersService.findByEmail(userDto.email),
      this.usersService.findOne(userDto.username),
    ]);

    if (existingEmail) {
      throw new ConflictException("Email already registered");
    }

    if (existingUsername) {
      throw new ConflictException("Username already taken");
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
        last_login: new Date(),
      });

      user.roles = ["user"];

      // Generate verification token instead of code
      const verificationToken = this.generateVerificationToken();
      const verificationExpires = new Date();
      verificationExpires.setHours(verificationExpires.getHours() + 24);

      user.verification_token = verificationToken;
      user.verification_expires = verificationExpires;
      await user.save();

      // Send verification email with deep link
      await this.sendVerificationEmail(user, verificationToken);

      return {
        message:
          "User created successfully. Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === 11000) {
        // MongoDB duplicate key error
        throw new ConflictException("User already exists");
      }

      throw new BadRequestException("Could not create user");
    }
  }

  private async sendVerificationEmail(user: User, token: string) {
    try {
      // Create a deep link URL using the app scheme
      const verificationLink = `${this.configService.get("MOBILE_APP_SCHEME")}://verify-email?token=${token}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: "Verify your LocalMinds account",
        text: `
Hello ${user.username},

Thank you for creating a LocalMinds account! Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 24 hours.

If you did not create a LocalMinds account, please ignore this email.
                `,
        html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2>Welcome to LocalMinds!</h2>
                        <p>Hello ${user.username},</p>
                        <p>Thank you for creating a LocalMinds account! Please verify your email address by clicking the button below:</p>
                        <div style="margin: 24px 0;">
                            <a href="${verificationLink}" 
                               style="background-color: #4CAF50;
                                      color: white;
                                      padding: 12px 24px;
                                      text-decoration: none;
                                      border-radius: 4px;
                                      display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="color: #666;">${verificationLink}</p>
                        <p>This link will expire in 24 hours.</p>
                        <p>If you did not create a LocalMinds account, please ignore this email.</p>
                    </div>
                `,
      });
    } catch (error) {
      console.error("Email sending error:", error);
    }
  }

  // Helper method to generate Android app signature
  private generateAppSignature(): string {
    // This should be your actual app hash from Firebase or your Android app
    return "AH3dF8s0Df9"; // Example hash
  }

  private async sendPasswordResetEmail(user: User, token: string) {
    try {
      const resetLink = `${this.configService.get("MOBILE_APP_SCHEME")}://reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: "Reset Your Password",
        text: `
Hello ${user.username},

You have requested to reset your password. Click the link below to reset your password:

${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email.
                `,
        html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2>Hello ${user.username},</h2>
                        <p>You have requested to reset your password. Click the button below to reset your password:</p>
                        <div style="margin: 24px 0;">
                            <a href="${resetLink}" 
                               style="background-color: #4CAF50;
                                      color: white;
                                      padding: 12px 24px;
                                      text-decoration: none;
                                      border-radius: 4px;
                                      display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="color: #666;">${resetLink}</p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                    </div>
                `,
      });
    } catch (error) {
      console.error("Email sending error:", error);
    }
  }

  // Add this new method for email verification
  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException("Invalid verification token");
    }

    if (user.verification_expires < new Date()) {
      throw new BadRequestException({
        message: "Verification token has expired",
        code: "TOKEN_EXPIRED",
        email: user.email,
      });
    }

    if (user.is_verified) {
      throw new BadRequestException("Email already verified");
    }

    user.is_verified = true;
    user.verification_token = null;
    user.verification_expires = null;
    await user.save();

    return {
      message: "Email verified successfully",
      is_verified: true,
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async resendVerificationEmail(email: string) {
    // Check rate limiting
    await this.rateLimiterService.checkRateLimit(
      `resend_verification_${email}`
    );

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (user.is_verified) {
      throw new BadRequestException("Email is already verified");
    }

    // Generate new verification token
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Update user with new verification token
    user.verification_token = verificationToken;
    user.verification_expires = verificationExpires;
    await user.save();

    // Send new verification email
    try {
      await this.sendVerificationEmail(user, verificationToken);
      return {
        message: "Verification email sent successfully",
        email: user.email,
      };
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new BadRequestException("Failed to send verification email");
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Return user data excluding sensitive information
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
      is_verified: user.is_verified,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      roles: user.roles,
      created_at: user.created_at,
      modified_at: user.modified_at,
    };
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    return !!user; // Return true if user exists, false otherwise
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.usersService.findOne(username);
    return !!user; // Return true if user exists, false otherwise
  }

  // Update the signup method to use a longer token instead of 6-digit code
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDTO) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Handle email change
    if (updateDto.email && updateDto.email !== user.email) {
      if (!updateDto.current_password) {
        throw new BadRequestException(
          "Current password is required to change email"
        );
      }

      const isPasswordValid = await bcrypt.compare(
        updateDto.current_password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid password");
      }

      return this.initiateEmailChange(user, updateDto.email);
    }

    // Handle username change
    if (updateDto.username && updateDto.username !== user.username) {
      if (!updateDto.current_password) {
        throw new BadRequestException(
          "Current password is required to change username"
        );
      }

      const isPasswordValid = await bcrypt.compare(
        updateDto.current_password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid password");
      }

      return this.changeUsername(user, updateDto.username);
    }

    // Handle other profile updates
    const updatedUser = await this.usersService.update(userId, {
      firstname: updateDto.firstname,
      lastname: updateDto.lastname,
      phone: updateDto.phone,
      bio: updateDto.bio,
    });

    return this.mapUserToProfileResponse(updatedUser);
  }

  private async initiateEmailChange(user: User, newEmail: string) {
    // Check if new email is already in use
    const existingUser = await this.usersService.findByEmail(newEmail);
    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    // Generate token for email change confirmation
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Update user with email change info
    user.email_change_token = token;
    user.email_change_expires = expires;
    user.new_email = newEmail;
    user.email_change_confirmed_old = false;
    await user.save();

    // Send confirmation emails
    await Promise.all([
      this.sendOldEmailConfirmation(user, token),
      this.sendNewEmailConfirmation(user, newEmail),
    ]);

    return {
      message:
        "Email change initiated. Please check your old and new email addresses for confirmation.",
      current_email: user.email,
      new_email: newEmail,
    };
  }

  private async changeUsername(user: User, newUsername: string) {
    const maxChanges = this.configService.get<number>("MAX_USERNAME_CHANGES");

    if (user.username_changes_count >= maxChanges) {
      throw new BadRequestException(
        `You have reached the maximum number of username changes (${maxChanges})`
      );
    }

    // Check if new username is available
    const existingUser = await this.usersService.findOne(newUsername);
    if (existingUser) {
      throw new ConflictException("Username already taken");
    }

    user.username = newUsername;
    user.username_changes_count += 1;
    await user.save();

    return {
      message: "Username updated successfully",
      remaining_changes: maxChanges - user.username_changes_count,
    };
  }

  private async sendOldEmailConfirmation(user: User, token: string) {
    const confirmationLink = `${this.configService.get("MOBILE_APP_SCHEME")}://confirm-email-change?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Confirm Email Change",
      html: `
                <h2>Confirm Email Change</h2>
                <p>We received a request to change your email address to ${user.new_email}</p>
                <p>Click the link below to confirm this change:</p>
                <a href="${confirmationLink}">Confirm Email Change</a>
                <p>If you didn't request this change, please ignore this email or contact support.</p>
            `,
    });
  }

  private async sendNewEmailConfirmation(user: User, newEmail: string) {
    await this.mailerService.sendMail({
      to: newEmail,
      subject: "Email Change Requested",
      html: `
                <h2>Email Change Requested</h2>
                <p>This email address has been requested as the new email for your LocalMinds account.</p>
                <p>Once confirmed from your current email address, you will receive another email to verify this new address.</p>
                <p>If you didn't request this change, please ignore this email.</p>
            `,
    });
  }

  async confirmEmailChange(token: string) {
    const user = await this.usersService.findByEmailChangeToken(token);
    if (!user) {
      throw new BadRequestException("Invalid token");
    }

    if (user.email_change_expires < new Date()) {
      throw new BadRequestException("Token expired");
    }

    if (!user.email_change_confirmed_old) {
      // First confirmation from old email
      user.email_change_confirmed_old = true;
      await user.save();

      // Send verification to new email
      const verificationToken = this.generateVerificationToken();
      await this.sendVerificationEmail(user, verificationToken);

      return {
        message:
          "Email change confirmed. Please verify your new email address.",
      };
    }

    // Update email and reset verification status
    user.email = user.new_email;
    user.is_verified = false;
    user.email_change_token = null;
    user.email_change_expires = null;
    user.new_email = null;
    user.email_change_confirmed_old = false;
    await user.save();

    return {
      message:
        "Email changed successfully. Please verify your new email address.",
    };
  }

  // Add this method to AuthService
  private mapUserToProfileResponse(user: User) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
      is_verified: user.is_verified,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      roles: user.roles,
      created_at: user.created_at,
      modified_at: user.modified_at,
    };
  }
}
