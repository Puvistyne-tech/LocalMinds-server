import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PostsModule} from './post/post.module';
import {CategoryModule} from './category/category.module';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGODB_URI,
                dbName: process.env.DB_NAME,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        }),
        UserModule,
        AuthModule,
        PostsModule,
        // CategoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
