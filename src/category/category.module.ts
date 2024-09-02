import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CategoryService} from './category.service';
import {CategoryController} from "./category.controller";
import {Category, CategorySchema} from "./entities/category.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}]),
    ],
    providers: [CategoryService],
    exports: [CategoryService, MongooseModule], // Export MongooseModule if required
    controllers: [CategoryController]
})
export class CategoryModule {
}
