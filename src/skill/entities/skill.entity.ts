// import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
// import {Document} from 'mongoose';
// import {SkillItem} from "./skillTtem.entity";
//
// @Schema()
// export class Skill extends Document {
//     @Prop({required: true})
//     name: string;
//
//     @Prop({required: true})
//     description: string;
//
//     @Prop({required: true, default: new Date()})
//     date_created: Date;
//
//     @Prop({required: true, default: new Date()})
//     date_modified: Date;
//
//     @Prop({required: true})
//     skill_items: SkillItem[];
//
//     @Prop({required: true})
//     tags: string[];
//
//     @Prop({required: true})
//     category: String; // Reference to Category schema
// }
//
// export type SkillDocument = Skill & Document;
// export const SkillSchema = SchemaFactory.createForClass(Skill);


import {Document, Schema} from 'mongoose';
import {SkillItem} from "./skillTtem.entity";

export interface Skill extends Document {
    name: string;
    description: string;
    category: string;
    tags: string[];
    date_created: Date;
    date_modified: Date;
    skill_items: SkillItem[];
}

const SkillSchema = new Schema<Skill>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    tags: {type: [String], default: []},
    date_created: {type: Date, default: Date.now},
    date_modified: {type: Date, default: Date.now},
    skill_items: {type: [{type: Schema.Types.Mixed}], default: []},
});

export {SkillSchema, SkillItem};
