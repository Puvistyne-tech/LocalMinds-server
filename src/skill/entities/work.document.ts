import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SkillItem, SkillItemSchema, SkillItemType } from './skillTtem.entity';

// export type WorkDocument = Work & Document;

@Schema()
export class Work extends SkillItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  time_slots: string[]; // Assuming time slots are strings, adjust if needed

  @Prop({ default: () => new Date() }) // Set default value to current date
  date_created: Date;

  @Prop({ default: () => new Date() }) // Set default value to current date
  date_modified: Date;
}

// Using discriminator for the schema
export const WorkSchema = SkillItemSchema.discriminator(
  SkillItemType.WORK,
  SchemaFactory.createForClass(Work),
);

// Middleware to handle pre-save operations
// WorkSchema.pre('save', function (next) {
//   if (!this.date_created) {
//     this.date_created = new Date();
//   }
//   this.date_modified = new Date();
//   next();
// });

