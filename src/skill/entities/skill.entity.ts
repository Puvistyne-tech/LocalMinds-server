import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

@Schema()
export class Skill extends Document {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true, default: new Date()})
    date_created: Date;

    @Prop({required: true, default: new Date()})
    date_modified: Date;

    @Prop({required: true})
    skill_items: any[];

    @Prop({required: true})
    tags: string[];

    @Prop({type: Types.ObjectId, ref: 'Category', required: true})
    category: Types.ObjectId; // Reference to Category schema
}

export type SkillDocument = Skill & Document;
export const SkillSchema = SchemaFactory.createForClass(Skill);
