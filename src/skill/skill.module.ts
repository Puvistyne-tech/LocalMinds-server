import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillsController } from './skill.controller'; // Corrected import
import { SkillsService } from './skill.service';
import { Skill, SkillSchema } from './entities/skill.entity';

import { Work, WorkSchema } from './entities/work.document';
import {
  Link,
  LinkSchema,
  Text,
  TextSchema,
} from './entities/skillTtem.entity';
import { Photo, PhotoSchema } from './entities/photo.document'; // Corrected import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skill.name, schema: SkillSchema },
      { name: Work.name, schema: WorkSchema },
      { name: Photo.name, schema: PhotoSchema },
      { name: Link.name, schema: LinkSchema },
      { name: Text.name, schema: TextSchema },
    ]),
  ],
  controllers: [SkillsController], // Corrected usage
  providers: [SkillsService], // Corrected usage
})
export class SkillsModule {}
