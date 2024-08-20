import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SkillItemType {
  TEXT = 'Text',
  LINK = 'Link',
  PHOTO = 'Photo',
  WORK = 'Work',
}

@Schema({ discriminatorKey: 'type' })
export class SkillItem extends Document {
  // constructor({ order }) {
  //   super();
  //   this.order = order;
  // }

  @Prop({ required: true })
  order: number;
}

@Schema()
export class Text extends SkillItem {
  @Prop({ required: true })
  text: string;
}

@Schema()
export class Link extends SkillItem {
  @Prop({ required: true })
  link: string;
  @Prop({ required: false })
  description: string;
}

export const SkillItemSchema = SchemaFactory.createForClass(SkillItem);

export const LinkSchema = SkillItemSchema.discriminator(
  SkillItemType.LINK,
  SchemaFactory.createForClass(Link),
);

export const TextSchema = SkillItemSchema.discriminator(
  SkillItemType.TEXT,
  SchemaFactory.createForClass(Text),
);

// export type PhotoDocument = Photo & Document;
// export type LinkDocument = Link & Document;
// export type TextDocument = Texts & Document;
