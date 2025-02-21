import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class Category extends Document {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({type: [String], default: []})
    subcategories?: String[];

    @Prop({type: String, default: null})
    icon?: string;  // URL or icon identifier for the category

    // @Prop({type: [{type: Types.ObjectId, ref: 'Category'}], default: []})
    // subcategories?: Types.ObjectId[]; // Array of references to subcategories
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;

export interface Category {
  name: string;
  subcategories?: String[];  // Make sure this exists
  icon?: string;  // Add this to the interface as well
}
