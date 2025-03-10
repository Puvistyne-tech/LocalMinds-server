import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserService} from './user.service';
import {UserSchema} from './entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'User', schema: UserSchema}
        ])
    ],
    providers: [UserService],
    exports: [UserService, MongooseModule]
})
export class UserModule {
}
