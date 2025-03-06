import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument, MessageDeliveryStatus } from '../schemas/message.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { GroupMembership, GroupMembershipDocument, GroupRole } from '../schemas/group-membership.schema';
import { GroupJoinRequest, GroupJoinRequestDocument, RequestStatus } from '../schemas/group-join-request.schema';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { User } from '../../user/entities/user.entity';


@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(GroupMembership.name) private membershipModel: Model<GroupMembershipDocument>,
    @InjectModel(GroupJoinRequest.name) private joinRequestModel: Model<GroupJoinRequestDocument>,
  ) {}

  async sendDirectMessage(sender: User, createMessageDto: CreateMessageDto) {
    const message = new this.messageModel({
      content: createMessageDto.content,
      sender: new Types.ObjectId(sender._id),
      recipient: new Types.ObjectId(createMessageDto.recipientId),
    });
    return message.save();
  }

  async sendGroupMessage(sender: User, createMessageDto: CreateMessageDto) {
    const group = await this.groupModel.findById(createMessageDto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = await this.membershipModel.findOne({
      user: new Types.ObjectId(sender._id),
      group: new Types.ObjectId(createMessageDto.groupId),
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const message = new this.messageModel({
      content: createMessageDto.content,
      sender: new Types.ObjectId(sender._id),
      group: new Types.ObjectId(createMessageDto.groupId),
    });
    return message.save();
  }

  async createGroup(creator: User, createGroupDto: CreateGroupDto) {
    const group = new this.groupModel({
      ...createGroupDto,
      creator: new Types.ObjectId(creator._id),
    });
    await group.save();

    // Add creator as admin
    const membership = new this.membershipModel({
      user: new Types.ObjectId(creator._id),
      group: group._id,
      role: GroupRole.ADMIN,
    });
    await membership.save();

    return group;
  }

  async requestToJoinGroup(user: User, groupId: string) {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existingMembership = await this.membershipModel.findOne({
      user: new Types.ObjectId(user._id),
      group: new Types.ObjectId(groupId),
    });

    if (existingMembership) {
      throw new ForbiddenException('You are already a member of this group');
    }

    const existingRequest = await this.joinRequestModel.findOne({
      user: new Types.ObjectId(user._id),
      group: new Types.ObjectId(groupId),
      status: RequestStatus.PENDING,
    });

    if (existingRequest) {
      throw new ForbiddenException('You already have a pending request to join this group');
    }

    const request = new this.joinRequestModel({
      user: new Types.ObjectId(user._id),
      group: new Types.ObjectId(groupId),
      status: RequestStatus.PENDING,
    });
    return request.save();
  }

  async processJoinRequest(adminUser: User, requestId: string, accept: boolean) {
    const request = await this.joinRequestModel.findById(requestId).populate('group');
    if (!request) {
      throw new NotFoundException('Join request not found');
    }

    const adminMembership = await this.membershipModel.findOne({
      user: new Types.ObjectId(adminUser._id),
      group: request.group._id,
      role: GroupRole.ADMIN,
    });

    if (!adminMembership) {
      throw new ForbiddenException('Only group admins can process join requests');
    }

    request.status = accept ? RequestStatus.ACCEPTED : RequestStatus.REJECTED;
    request.processedAt = new Date();
    await request.save();

    if (accept) {
      const membership = new this.membershipModel({
        user: request.user,
        group: request.group._id,
        role: GroupRole.MEMBER,
      });
      await membership.save();
    }

    return request;
  }

  async getDirectMessages(userId: string) {
    return this.messageModel
      .find({
        $or: [
          { sender: new Types.ObjectId(userId), recipient: { $exists: true } },
          { recipient: new Types.ObjectId(userId) },
        ],
      })
      .sort({ createdAt: -1 })
      .populate('sender')
      .populate('recipient');
  }

  async getGroupMessages(groupId: string, userId: string) {
    const membership = await this.membershipModel.findOne({
      user: new Types.ObjectId(userId),
      group: new Types.ObjectId(groupId),
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return this.messageModel
      .find({ group: new Types.ObjectId(groupId) })
      .sort({ createdAt: -1 })
      .populate('sender')
      .populate('group');
  }

  async getUserGroupMemberships(userId: string) {
    return this.membershipModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('group')
      .exec();
  }

  async markMessageAsRead(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.recipient?.toString() !== userId) {
      throw new ForbiddenException('You can only mark your own messages as read');
    }

    message.isRead = true;
    message.readAt = new Date();
    message.deliveryStatus = MessageDeliveryStatus.READ;
    await message.save();
    return message;
  }

  async markMessageAsDelivered(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.recipient?.toString() !== userId) {
      throw new ForbiddenException('You can only mark your own messages as delivered');
    }

    if (message.deliveryStatus === MessageDeliveryStatus.SENT) {
      message.deliveryStatus = MessageDeliveryStatus.DELIVERED;
      message.deliveredAt = new Date();
      await message.save();
    }
    return message;
  }

  async markMessagesAsDelivered(userId: string) {
    const messages = await this.messageModel.find({
      recipient: new Types.ObjectId(userId),
      deliveryStatus: MessageDeliveryStatus.SENT,
    });

    const now = new Date();
    const updates = messages.map(message => ({
      ...message,
      deliveryStatus: MessageDeliveryStatus.DELIVERED,
      deliveredAt: now,
    }));

    if (updates.length > 0) {
      await this.messageModel.bulkWrite(
        updates.map(update => ({
          updateOne: {
            filter: { _id: update._id },
            update: {
              $set: {
                deliveryStatus: MessageDeliveryStatus.DELIVERED,
                deliveredAt: now,
              },
            },
          },
        }))
      );
    }

    return messages;
  }

  async getUnreadMessageCount(userId: string) {
    return this.messageModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      isRead: false,
    });
  }
} 