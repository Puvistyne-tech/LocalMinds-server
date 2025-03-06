import { ApiProperty } from '@nestjs/swagger';

export const MESSAGING_DOCS = {
  WEBSOCKET_CONNECTION: {
    description: `WebSocket connection endpoint. Connect using Socket.IO client.
    Required headers:
    - Authorization: Bearer <jwt_token>
    
    Example:
    const socket = io('your_server_url', {
      extraHeaders: { Authorization: 'Bearer your_jwt_token' }
    });`,
  },

  DIRECT_MESSAGE: {
    summary: 'Send a direct message to another user',
    description: `Sends a real-time message to a specific user.
    - Supports typing indicators
    - Includes delivery status (sent, delivered, read)
    - Real-time notifications`,
  },

  GROUP_MESSAGE: {
    summary: 'Send a message to a group',
    description: `Sends a real-time message to all members of a group.
    - Supports typing indicators
    - Members receive real-time notifications
    - Requires group membership`,
  },

  CREATE_GROUP: {
    summary: 'Create a new messaging group',
    description: `Creates a new group and sets creator as admin.
    - Creator automatically becomes admin
    - Supports group name and description
    - Real-time group creation notification`,
  },

  JOIN_GROUP: {
    summary: 'Request to join a group',
    description: `Sends a join request to a group.
    - Request requires admin approval
    - Prevents duplicate requests
    - Real-time notification to group admins`,
  },

  PROCESS_JOIN_REQUEST: {
    summary: 'Process a group join request',
    description: `Accept or reject a group join request.
    - Only group admins can process requests
    - Real-time notification to requestor
    - Automatic group membership on acceptance`,
  },

  GET_DIRECT_MESSAGES: {
    summary: 'Get direct message history',
    description: `Retrieves direct message history with a specific user.
    - Messages are sorted by date
    - Includes delivery and read status
    - Supports pagination`,
  },

  GET_GROUP_MESSAGES: {
    summary: 'Get group message history',
    description: `Retrieves message history for a specific group.
    - Requires group membership
    - Messages are sorted by date
    - Includes sender information`,
  },
};

// WebSocket Event Documentation
export const WEBSOCKET_EVENTS = {
  // Emitted Events (Client -> Server)
  EMIT: {
    TYPING_STATUS: {
      event: 'typing_status',
      payload: {
        userId: 'string',
        recipientId: 'string (optional)',
        groupId: 'string (optional)',
        isTyping: 'boolean',
      },
      description: 'Notify when user starts/stops typing',
    },
    MARK_AS_READ: {
      event: 'mark_as_read',
      payload: 'string (messageId)',
      description: 'Mark a message as read',
    },
    MARK_AS_DELIVERED: {
      event: 'mark_as_delivered',
      payload: 'string (messageId)',
      description: 'Mark a message as delivered',
    },
  },

  // Listened Events (Server -> Client)
  LISTEN: {
    NEW_DIRECT_MESSAGE: {
      event: 'new_direct_message',
      payload: 'MessageDocument',
      description: 'Receive new direct message',
    },
    NEW_GROUP_MESSAGE: {
      event: 'new_group_message',
      payload: 'MessageDocument',
      description: 'Receive new group message',
    },
    TYPING_STATUS_UPDATE: {
      event: 'typing_status_update',
      payload: {
        chatId: 'string',
        typingUsers: 'string[]',
      },
      description: 'Receive typing status updates',
    },
    MESSAGE_READ: {
      event: 'message_read',
      payload: {
        messageId: 'string',
        readBy: 'string (userId)',
        readAt: 'Date',
      },
      description: 'Notification when message is read',
    },
    MESSAGE_DELIVERED: {
      event: 'message_delivered',
      payload: {
        messageId: 'string',
        deliveredTo: 'string (userId)',
        deliveredAt: 'Date',
      },
      description: 'Notification when message is delivered',
    },
  },
}; 