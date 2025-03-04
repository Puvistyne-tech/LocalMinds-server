import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ContactReasonType } from '../enums/contact-reason.enum';

@Schema({
    timestamps: true,
})
export class ContactSubmission extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true, enum: ContactReasonType })
    contactReason: ContactReasonType;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    ipAddress: string;

    @Prop({ required: true })
    userAgent: string;
}

export const ContactSubmissionSchema = SchemaFactory.createForClass(ContactSubmission); 