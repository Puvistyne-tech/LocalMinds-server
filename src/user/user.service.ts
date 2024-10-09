import {ConflictException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {User} from './entities/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {plainToInstance} from "class-transformer";
import {UserDto} from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel("User") private userModel: Model<User>,
    ) {
    }

    findAll() {
        return this.userModel.find().exec();
    }

    findOneById(id: String): Promise<User | undefined> {
        return this.userModel.findById(id).exec();
    }

    async create(userDto: CreateUserDto): Promise<User> {
        const existingUsername = await this.userModel.findOne({
            username: userDto.username,
        });

        if (existingUsername) {
            throw new ConflictException('Username already exists');
        }

        const existingEmail = await this.userModel.findOne({
            email: userDto.email,
        });

        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(userDto.password, 10);

        const user = new this.userModel({
            ...userDto,
            password: hashedPassword,
        });

        return user.save();
    }

    async remove(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.userModel.findOne({username}).exec();
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {
            new: true,
        }).exec();
    }
}
