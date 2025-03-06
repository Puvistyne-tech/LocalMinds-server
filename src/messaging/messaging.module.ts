import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagingController } from './controllers/messaging.controller';
import { MessagingService } from './services/messaging.service';
import { MessagingGateway } from './gateways/messaging.gateway';
import { Message, MessageSchema } from './schemas/message.schema';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupMembership, GroupMembershipSchema } from './schemas/group-membership.schema';
import { GroupJoinRequest, GroupJoinRequestSchema } from './schemas/group-join-request.schema';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Group.name, schema: GroupSchema },
      { name: GroupMembership.name, schema: GroupMembershipSchema },
      { name: GroupJoinRequest.name, schema: GroupJoinRequestSchema },
    ]),
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway],
  exports: [MessagingService],
})
export class MessagingModule {} 