import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {User, UserSchema} from './entities/user.entity';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        MongooseModule.forFeature([
            {name: 'User', schema: UserSchema},
        ]), // Import it here
    ],
    exports: [UserService],
})
export class UserModule {
}
