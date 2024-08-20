import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOneById(id: string): Promise<User | undefined>;
    create(userDto: CreateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    findOne(username: string): Promise<User | undefined>;
    update(id: number, updateUserDto: UpdateUserDto): string;
}
