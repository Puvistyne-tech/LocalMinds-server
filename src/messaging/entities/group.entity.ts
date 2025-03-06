import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';
import { GroupMembership } from './group-membership.entity';
import { GroupJoinRequest } from './group-join-request.entity';


@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @OneToMany(() => GroupMembership, membership => membership.group)
  memberships: GroupMembership[];

  @OneToMany(() => Message, message => message.group)
  messages: Message[];

  @OneToMany(() => GroupJoinRequest, request => request.group)
  joinRequests: GroupJoinRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 