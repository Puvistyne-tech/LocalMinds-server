import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

export enum MessageDeliveryStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  recipient?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group?: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: String, enum: MessageDeliveryStatus, default: MessageDeliveryStatus.SENT })
  deliveryStatus: MessageDeliveryStatus;

  @Prop()
  deliveredAt?: Date;

  @Prop()
  readAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message); 