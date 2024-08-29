import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {SkillsService} from './skill.service';
import {Skill, SkillSchema} from './entities/skill.entity';

import {Work, WorkSchema} from './entities/work.document';
import {Link, LinkSchema, Text, TextSchema,} from './entities/skillTtem.entity';
import {Photo, PhotoSchema} from './entities/photo.document';
import {CategoryModule} from "../category/category.module";
import {SkillsController} from "./skill.controller"; // Corrected import


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Skill.name, schema: SkillSchema},
            {name: Photo.name, schema: PhotoSchema},
            {name: Link.name, schema: LinkSchema},
            {name: Work.name, schema: WorkSchema},
            {name: Text.name, schema: TextSchema},
        ]),
        CategoryModule, // Import it here
    ],
    providers: [SkillsService],
    exports: [SkillsService],
    controllers: [SkillsController]
})
export class SkillsModule {
}
