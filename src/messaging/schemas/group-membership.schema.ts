import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupMembershipDocument = GroupMembership & Document;

export enum GroupRole {
  MEMBER = 'member',
  ADMIN = 'admin'
}

@Schema({ timestamps: true })
export class GroupMembership {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId;

  @Prop({ type: String, enum: GroupRole, default: GroupRole.MEMBER })
  role: GroupRole;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;
}

export const GroupMembershipSchema = SchemaFactory.createForClass(GroupMembership); 