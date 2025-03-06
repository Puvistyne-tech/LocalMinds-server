import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsDate,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ example: "johndoe", description: "Username" })
  @IsString()
  username: string;

  @ApiProperty({ example: "john@example.com", description: "Email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", description: "Password" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "+1234567890", description: "Phone number" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "John", description: "First name", required: false })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiProperty({ example: "Doe", description: "Last name", required: false })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({
    example: false,
    description: "Is user verified",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @ApiProperty({
    example: true,
    description: "Is user active",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: new Date(),
    description: "Created at",
    required: false,
  })
  @IsDate()
  @IsOptional()
  created_at?: Date;

  @ApiProperty({
    example: new Date(),
    description: "Last login",
    required: false,
  })
  @IsDate()
  @IsOptional()
  last_login?: Date;

  @ApiProperty({
    example: ["user"],
    description: "User roles",
    required: false,
  })
  @IsOptional()
  roles?: string[];

  @ApiProperty({
    example: "Bio text here",
    description: "User bio",
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: "avatar-url",
    description: "User avatar URL",
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}

//Create user dto with only required fields
export class CreateUserDto {
  @ApiProperty({ example: "johndoe", description: "Username" })
  @IsString()
  username: string;

  @ApiProperty({ example: "john@example.com", description: "Email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", description: "Password" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "+1234567890", description: "Phone number" })
  @IsString()
  phone: string;
}
