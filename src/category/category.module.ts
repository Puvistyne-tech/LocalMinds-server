import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CategoryService} from './category.service';
import {Category, CategorySchema} from './entities/category.entity';
import {CategoryController} from "./category.controller";

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
