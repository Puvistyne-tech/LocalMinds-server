import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Skill extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: new Date() })
  date_created: Date;

  @Prop({ required: true, default: new Date() })
  date_modified: Date;

  @Prop({ required: true })
  skillItems: any[];

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  category: string;
}

export type SkillDocument = Skill & Document;
export const SkillSchema = SchemaFactory.createForClass(Skill);
