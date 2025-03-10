import {Body, Controller, Delete, Get, Param, Patch, Post,} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserDto} from "./dto/user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }


    // @Post()
    // create(@Body() createUserDto: CreateUserDto) {
    //     return this.userService.create(createUserDto);
    // }

    @Get()
    async findAll() {
        return UserDto.many(await this.userService.findAll());
        // return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOneById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
