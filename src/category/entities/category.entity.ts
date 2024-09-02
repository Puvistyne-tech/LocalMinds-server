import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class Category extends Document {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({type: [String], default: []})
    subcategories?: String[];

    // @Prop({type: [{type: Types.ObjectId, ref: 'Category'}], default: []})
    // subcategories?: Types.ObjectId[]; // Array of references to subcategories
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;
