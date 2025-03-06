import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { MessagingService } from '../services/messaging.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { User } from '../../user/entities/user.entity';
import { MessageDeliveryStatus } from '../schemas/message.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface TypingStatus {
  userId: string;
  recipientId?: string;
  groupId?: string;
  isTyping: boolean;
}

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
  },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId
  private socketUsers: Map<string, string> = new Map(); // socketId -> userId
  private typingUsers: Map<string, Set<string>> = new Map(); // chatId -> Set of typing userIds

  constructor(private readonly messagingService: MessagingService) {}

  async handleConnection(client: Socket) {
    try {
      // Get user from token
      const user = client.handshake.auth.user as User;
      if (user && user._id) {
        this.userSockets.set(user._id.toString(), client.id);
        this.socketUsers.set(client.id, user._id.toString());
        
        // Join user's personal room
        await client.join(`user_${user._id}`);
        
        // Join rooms for all groups user is a member of
        const memberships = await this.messagingService.getUserGroupMemberships(user._id.toString());
        for (const membership of memberships) {
          await client.join(`group_${membership.group}`);
        }

        // Mark messages as delivered for this user
        await this.messagingService.markMessagesAsDelivered(user._id.toString());
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      this.userSockets.delete(userId);
      this.socketUsers.delete(client.id);
      
      // Clear typing status when user disconnects
      this.clearUserTypingStatus(userId);
    }
  }

  private clearUserTypingStatus(userId: string) {
    for (const [chatId, typingUsers] of this.typingUsers.entries()) {
      if (typingUsers.has(userId)) {
        typingUsers.delete(userId);
        this.broadcastTypingStatus(chatId);
      }
    }
  }

  private getChatId(recipientId?: string, groupId?: string): string {
    return groupId ? `group_${groupId}` : `direct_${recipientId}`;
  }

  private broadcastTypingStatus(chatId: string) {
    const typingUsers = Array.from(this.typingUsers.get(chatId) || []);
    this.server.to(chatId).emit('typing_status_update', { chatId, typingUsers });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('typing_status')
  async handleTypingStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() status: TypingStatus,
  ) {
    const user = client.handshake.auth.user as User;
    const chatId = this.getChatId(status.recipientId, status.groupId);

    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new Set());
    }

    const typingSet = this.typingUsers.get(chatId)!;
    if (status.isTyping) {
      typingSet.add(user._id.toString());
    } else {
      typingSet.delete(user._id.toString());
    }

    this.broadcastTypingStatus(chatId);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('send_direct_message')
  async handleDirectMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const user = client.handshake.auth.user as User;
    const message = await this.messagingService.sendDirectMessage(user, createMessageDto);
    
    // Clear typing status
    const chatId = this.getChatId(createMessageDto.recipientId);
    const typingSet = this.typingUsers.get(chatId);
    if (typingSet) {
      typingSet.delete(user._id.toString());
      this.broadcastTypingStatus(chatId);
    }
    
    // Emit to sender
    this.server.to(`user_${user._id}`).emit('new_direct_message', message);
    
    // Emit to recipient
    if (createMessageDto.recipientId) {
      this.server.to(`user_${createMessageDto.recipientId}`).emit('new_direct_message', message);
    }
    
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('send_group_message')
  async handleGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const user = client.handshake.auth.user as User;
    const message = await this.messagingService.sendGroupMessage(user, createMessageDto);
    
    // Clear typing status
    const chatId = this.getChatId(undefined, createMessageDto.groupId);
    const typingSet = this.typingUsers.get(chatId);
    if (typingSet) {
      typingSet.delete(user._id.toString());
      this.broadcastTypingStatus(chatId);
    }
    
    // Emit to all members in the group
    if (createMessageDto.groupId) {
      this.server.to(`group_${createMessageDto.groupId}`).emit('new_group_message', message);
    }
    
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageId: string,
  ) {
    const user = client.handshake.auth.user as User;
    const message = await this.messagingService.markMessageAsRead(messageId, user._id.toString());
    
    // Notify sender that message was read
    this.server.to(`user_${message.sender}`).emit('message_read', {
      messageId,
      readBy: user._id,
      readAt: message.readAt,
    });
    
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('mark_as_delivered')
  async handleMarkAsDelivered(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageId: string,
  ) {
    const user = client.handshake.auth.user as User;
    const message = await this.messagingService.markMessageAsDelivered(messageId, user._id.toString());
    
    // Notify sender that message was delivered
    this.server.to(`user_${message.sender}`).emit('message_delivered', {
      messageId,
      deliveredTo: user._id,
      deliveredAt: message.deliveredAt,
    });
    
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('join_group')
  async handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() groupId: string,
  ) {
    const user = client.handshake.auth.user as User;
    await client.join(`group_${groupId}`);
    return { status: 'joined' };
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leave_group')
  async handleLeaveGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() groupId: string,
  ) {
    await client.leave(`group_${groupId}`);
    return { status: 'left' };
  }
} 