import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from './group.entity';

export enum GroupRole {
  MEMBER = 'member',
  ADMIN = 'admin'
}

@Entity('group_memberships')
export class GroupMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Group, group => group.memberships)
  group: Group;

  @Column({
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.MEMBER
  })
  role: GroupRole;

  @CreateDateColumn()
  joinedAt: Date;
} 