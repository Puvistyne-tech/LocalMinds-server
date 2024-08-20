import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';  // Import bcrypt


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    // Check if the username already exists
    const existingUsername = await this.usersRepository.findOne({
      where: { username: userDto.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if the email already exists
    const existingEmail = await this.usersRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Convert DTO to User entity and set the hashed password
    const user = userDto.toUser();
    user.password = hashedPassword;

    // Save the new user entity
    return this.usersRepository.save(user);
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto.username} user`;
  }
}
