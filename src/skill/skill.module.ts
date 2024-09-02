import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {SkillsService} from './skill.service';
import {SkillSchema} from './entities/skill.entity';
import {CategoryModule} from "../category/category.module";
import {SkillsController} from "./skill.controller";
import {SkillItemSchema} from "./entities/skillTtem.entity"; // Corrected import


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Skill', schema: SkillSchema},
            {name: 'SkillItem', schema: SkillItemSchema},]),
        CategoryModule, // Import it here
    ],
    providers: [SkillsService],
    exports: [SkillsService],
    controllers: [SkillsController]
})
export class SkillsModule {
}
