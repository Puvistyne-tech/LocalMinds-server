import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {SkillsModule} from './skill/skill.module';
import {CategoryModule} from './category/category.module';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        ConfigModule.forRoot({isGlobal: true}),
        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: process.env.DB_HOST,
        //   port: parseInt(process.env.DB_PORT, 10),
        //   username: process.env.DB_USERNAME,
        //   password: process.env.DB_PASSWORD,
        //   database: process.env.DB_DATABASE,
        //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //   synchronize: true, // Set to false in production
        // }),
        // AuthModule,
        // UserModule,
        // EventModule,
        SkillsModule,
        // CategoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
