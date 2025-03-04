import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ContactFormDto } from './dto/contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactSubmission } from './entities/contact-submission.entity';
import { ContactReasonDto, CONTACT_REASONS_MAP } from './dto/contact-reason.dto';
import { ContactReasonType } from './enums/contact-reason.enum';

@Injectable()
export class ContactService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @InjectModel(ContactSubmission.name)
        private contactSubmissionModel: Model<ContactSubmission>,
    ) {}

    getContactReasons(): ContactReasonDto[] {
        return Array.from(CONTACT_REASONS_MAP.entries()).map(([value, { label, description }]) => ({
            value,
            label,
            description
        }));
    }

    async sendContactEmail(contactForm: ContactFormDto, ipAddress: string, userAgent: string): Promise<boolean> {
        const supportEmail = this.configService.get<string>('SUPPORT_EMAIL');
        
        try {
            // Save the submission
            await this.contactSubmissionModel.create({
                ...contactForm,
                ipAddress,
                userAgent,
            });

            // Get the user-friendly label for the contact reason
            const reasonInfo = CONTACT_REASONS_MAP.get(contactForm.contactReason);
            const reasonLabel = reasonInfo?.label || contactForm.contactReason;

            await this.mailerService.sendMail({
                to: supportEmail,
                from: this.configService.get<string>('MAIL_FROM'),
                subject: `Contact Form: ${contactForm.subject} (${reasonLabel})`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> ${contactForm.name} (${contactForm.email})</p>
                    <p><strong>Subject:</strong> ${contactForm.subject}</p>
                    <p><strong>Reason:</strong> ${reasonLabel}</p>
                    <h3>Message:</h3>
                    <p>${contactForm.message}</p>
                    <hr>
                    <p><small>IP Address: ${ipAddress}</small></p>
                    <p><small>User Agent: ${userAgent}</small></p>
                `,
            });

            // Send confirmation email to the user
            await this.mailerService.sendMail({
                to: contactForm.email,
                from: this.configService.get<string>('MAIL_FROM'),
                subject: 'We received your message - LocalMinds Support',
                html: `
                    <h2>Thank you for contacting us!</h2>
                    <p>Dear ${contactForm.name},</p>
                    <p>We have received your message and will get back to you as soon as possible.</p>
                    <p>For your records, here is a copy of your message:</p>
                    <hr>
                    <p><strong>Subject:</strong> ${contactForm.subject}</p>
                    <p><strong>Reason:</strong> ${reasonLabel}</p>
                    <p><strong>Message:</strong></p>
                    <p>${contactForm.message}</p>
                    <hr>
                    <p>Best regards,</p>
                    <p>The LocalMinds Support Team</p>
                `,
            });

            return true;
        } catch (error) {
            console.error('Error sending contact form email:', error);
            throw new InternalServerErrorException('Failed to send contact form. Please try again later.');
        }
    }
} 