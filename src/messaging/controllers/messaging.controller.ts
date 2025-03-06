import { Controller, Post, Get, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService } from '../services/messaging.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MESSAGING_DOCS } from '../docs/messaging.docs';

@ApiTags('Messaging')
@ApiBearerAuth()
@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('direct')
  @ApiOperation(MESSAGING_DOCS.DIRECT_MESSAGE)
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 403, description: 'Recipient ID is required' })
  async sendDirectMessage(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    if (!createMessageDto.recipientId) {
      throw new ForbiddenException('Recipient ID is required for direct messages');
    }
    return this.messagingService.sendDirectMessage(req.user, createMessageDto);
  }

  @Post('group')
  @ApiOperation(MESSAGING_DOCS.GROUP_MESSAGE)
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 403, description: 'Group ID is required or user is not a member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async sendGroupMessage(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    if (!createMessageDto.groupId) {
      throw new ForbiddenException('Group ID is required for group messages');
    }
    return this.messagingService.sendGroupMessage(req.user, createMessageDto);
  }

  @Post('groups')
  @ApiOperation(MESSAGING_DOCS.CREATE_GROUP)
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  async createGroup(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    return this.messagingService.createGroup(req.user, createGroupDto);
  }

  @Post('groups/:groupId/join')
  @ApiOperation(MESSAGING_DOCS.JOIN_GROUP)
  @ApiResponse({ status: 201, description: 'Join request sent successfully' })
  @ApiResponse({ status: 403, description: 'Already a member or pending request exists' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async requestToJoinGroup(@Request() req, @Param('groupId') groupId: string) {
    return this.messagingService.requestToJoinGroup(req.user, groupId);
  }

  @Post('groups/requests/:requestId/process')
  @ApiOperation(MESSAGING_DOCS.PROCESS_JOIN_REQUEST)
  @ApiResponse({ status: 200, description: 'Request processed successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to process request' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async processJoinRequest(
    @Request() req,
    @Param('requestId') requestId: string,
    @Body('accept') accept: boolean,
  ) {
    return this.messagingService.processJoinRequest(req.user, requestId, accept);
  }

  @Get('direct')
  @ApiOperation(MESSAGING_DOCS.GET_DIRECT_MESSAGES)
  @ApiResponse({ status: 200, description: 'Returns list of direct messages' })
  async getDirectMessages(@Request() req) {
    console.log(req.user);
    return this.messagingService.getDirectMessages(req.user.userId);
  }

  @Get('groups/:groupId/messages')
  @ApiOperation(MESSAGING_DOCS.GET_GROUP_MESSAGES)
  @ApiResponse({ status: 200, description: 'Returns list of group messages' })
  @ApiResponse({ status: 403, description: 'Not a member of the group' })
  async getGroupMessages(@Request() req, @Param('groupId') groupId: string) {
    return this.messagingService.getGroupMessages(groupId, req.user.id);
  }
} 