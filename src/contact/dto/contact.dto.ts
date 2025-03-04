import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactReasonType } from '../enums/contact-reason.enum';

export class ContactFormDto {
    @ApiProperty({ example: 'John Doe', description: 'Name of the person submitting the form' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address of the sender' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'App Feedback', description: 'Subject of the message' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    subject: string;

    @ApiProperty({
        enum: ContactReasonType,
        example: ContactReasonType.GENERAL_INQUIRY,
        description: 'Reason for contact'
    })
    @IsEnum(ContactReasonType)
    @IsNotEmpty()
    contactReason: ContactReasonType;

    @ApiProperty({ example: 'I found a bug in...', description: 'Content of the message' })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    message: string;
} 