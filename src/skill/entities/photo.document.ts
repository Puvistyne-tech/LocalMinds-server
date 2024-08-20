import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SkillItem, SkillItemSchema, SkillItemType } from './skillTtem.entity';

@Schema()
export class Photo extends SkillItem {
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  name: string;
}

export const PhotoSchema = SkillItemSchema.discriminator(
  SkillItemType.PHOTO,
  SchemaFactory.createForClass(Photo),
);
