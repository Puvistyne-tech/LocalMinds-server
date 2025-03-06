import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Recipient ID' })
  @IsOptional()
  @IsString()
  recipientId?: string;

  @ApiProperty({ description: 'Group ID' })
  @IsOptional()
  @IsString()
  groupId?: string;
} 