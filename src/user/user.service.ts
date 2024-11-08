import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel("User") private userModel: Model<User>,
    ) {}

    findAll() {
        return this.userModel.find().exec();
    }

    findOneById(id: String): Promise<User | undefined> {
        return this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByResetToken(token: string): Promise<User | undefined> {
        return this.userModel.findOne({ 
            reset_password_token: token,
            reset_password_expires: { $gt: new Date() }
        }).exec();
    }

    async findByVerificationToken(token: string): Promise<User | null> {
        return this.userModel.findOne({ verification_token: token }).exec();
    }

    async create(userDto: CreateUserDto): Promise<User> {
        try {
            const user = new this.userModel(userDto);
            return await user.save();
        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new ConflictException(`${field} already exists`);
            }
            throw new BadRequestException(error.message);
        }
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new BadRequestException({
                statusCode: 404,
                message: 'User not found',
                error: 'Not Found'
            });
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        if (updateUserDto.email || updateUserDto.username) {
            const existingUser = await this.userModel.findOne({
                $or: [
                    { email: updateUserDto.email },
                    { username: updateUserDto.username }
                ],
                _id: { $ne: id }
            });

            if (existingUser) {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Username or email already exists',
                    error: 'Conflict'
                });
            }
        }

        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                id, 
                updateUserDto,
                { new: true }
            ).exec();

            if (!updatedUser) {
                throw new BadRequestException({
                    statusCode: 404,
                    message: 'User not found',
                    error: 'Not Found'
                });
            }

            return updatedUser;
        } catch (error) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Failed to update user',
                error: 'Bad Request',
                details: error.message
            });
        }
    }
}
