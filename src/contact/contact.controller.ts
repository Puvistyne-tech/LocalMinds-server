import { Controller, Post, Get, Body, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactFormDto } from './dto/contact.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { ContactReasonDto } from './dto/contact-reason.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Get('reasons')
    @ApiOperation({ summary: 'Get available contact reasons' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of available contact reasons',
        type: [ContactReasonDto]
    })
    getContactReasons(): ContactReasonDto[] {
        return this.contactService.getContactReasons();
    }

    @Post()
    @UseGuards(ThrottlerGuard)
    @ApiOperation({ summary: 'Submit a contact form' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Contact form submitted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid form data' })
    @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Rate limit exceeded - maximum 3 requests per day, 10 per month' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to send contact form' })
    async submitContactForm(
        @Body() contactForm: ContactFormDto,
        @Req() request: Request
    ) {
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'] || 'Unknown';

        await this.contactService.sendContactEmail(contactForm, ipAddress, userAgent);
        return {
            statusCode: HttpStatus.OK,
            message: 'Your message has been sent successfully. We will get back to you soon.',
        };
    }
} 