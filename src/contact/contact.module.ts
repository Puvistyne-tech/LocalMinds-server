import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSubmission, ContactSubmissionSchema } from './entities/contact-submission.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ContactSubmission.name, schema: ContactSubmissionSchema }
        ]),
        ThrottlerModule.forRoot([{
            ttl: 24 * 60 * 60, // 24 hours
            limit: 3, // 3 requests per day
        },
        {
            ttl: 30 * 24 * 60 * 60, // 30 days
            limit: 10, // 10 requests per month
        }]),
    ],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule {} 