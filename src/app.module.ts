import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsModule } from "./post/post.module";
import { CategoryModule } from "./category/category.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ContactModule } from "./contact/contact.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    //print the uri
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGO_URL;
        const dbName = process.env.MONGO_DATABASE;

        console.log("Resolved MongoDB URI:", mongoUri);
        console.log("Database Name:", dbName);

        return {
          uri: mongoUri,
          dbName: dbName,
          family: 4, // Force IPv4
        };
      },
    }),

    // MongooseModule.forRootAsync({
    //     useFactory: () => {
    //         console.log('MongoDB URI:', process.env.MONGO_URL);
    //         console.log('Database Name:', process.env.DB_NAME);
    //         return {
    //             uri: process.env.MONGO_URL,
    //             dbName: process.env.DB_NAME,
    //             family: 4 // Force IPv4
    //         };
    //     },
    // }),
    UserModule,
    AuthModule,
    PostsModule,
    ContactModule,
    // CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
