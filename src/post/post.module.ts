import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {PostsService} from './post.service';
import {PostSchema} from './entities/post.entity';
import {CategoryModule} from "../category/category.module";
import {PostsController} from "./post.controller";
import {UserModule} from "../user/user.module";


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Post', schema: PostSchema},
        ]),
        CategoryModule,
        UserModule,
    ],
    providers: [PostsService],
    exports: [PostsService],
    controllers: [PostsController]
})
export class PostsModule {
}
