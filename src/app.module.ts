import {Module, Logger} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PostsModule} from './post/post.module';
import {CategoryModule} from './category/category.module';
import {ConfigModule} from '@nestjs/config';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        // Load environment variables globally
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Configure MongoDB connection
        MongooseModule.forRootAsync({
            useFactory: () => {
                const logger = new Logger('MongooseModule');
                const uri = process.env.MONGO_URI;

                // Log the MONGO_URI for debugging
                logger.log(`MONGO_URI: ${uri}`);

                if (!uri) {
                    throw new Error('MONGO_URI is not defined in environment variables.');
                }

                return {
                    uri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
            },
        }),

        // Import feature modules
        UserModule,
        AuthModule,
        PostsModule,
        // CategoryModule, // Uncomment if needed
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}