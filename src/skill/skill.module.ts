import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {SkillsService} from './skill.service';
import {SkillSchema} from './entities/skill.entity';
import {CategoryModule} from "../category/category.module";
import {SkillsController} from "./skill.controller";
import {UserModule} from "../user/user.module";


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Skill', schema: SkillSchema},
        ]),
        CategoryModule, // Import it here
        UserModule, // Import the module containing UserService
    ],
    providers: [SkillsService],
    exports: [SkillsService],
    controllers: [SkillsController]
})
export class SkillsModule {
}
