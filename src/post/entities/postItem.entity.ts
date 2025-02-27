// import {Document, model, Schema} from 'mongoose';
//
//
// export enum SkillItemType {
//     TEXT = 'text',
//     WORK = 'work',
//     LINK = 'link',
//     PHOTO = 'photo',
// }
//
// export interface SkillItem extends Document {
//     type: SkillItemType;
//     order: number;
// }
//
// export const SkillItemSchema = new Schema<SkillItem>({
//     type: {type: String, enum: Object.values(SkillItemType), required: true},
//     order: {type: Number, required: true}
// });
//
// // Text Schema
// export interface TextSkillItem extends SkillItem {
//     content: string;
// }
//
// export const TextSkillItemSchema = new Schema<TextSkillItem>({
//     content: {type: String, required: true},
// });
//
// // Work Schema
// export interface WorkSkillItem extends SkillItem {
//     title: string;
//     description: string;
//     location: string;
//     time_slots?: string[];
//     company?: string;
//     startDate?: Date;
//     endDate?: Date;
// }
//
// export const WorkSkillItemSchema = new Schema<WorkSkillItem>({
//     title: {type: String, required: true},
//     description: {type: String, required: true},
//     location: {type: String, required: true},
//     time_slots: {type: [String], required: false},
//     company: {type: String, required: false},
//     startDate: {type: Date, required: false},
//     endDate: {type: Date, required: false},
// });
//
// // Link Schema
// export interface LinkSkillItem extends SkillItem {
//     url: string;
// }
//
// export const LinkSkillItemSchema = new Schema<LinkSkillItem>({
//     url: {type: String, required: true},
// });
//
// // Photo Schema
// export interface PhotoSkillItem extends SkillItem {
//     link: string;
//     name: string;
//     description: string;
// }
//
// export const PhotoSkillItemSchema = new Schema<PhotoSkillItem>({
//     link: {type: String, required: true},
//     name: {type: String, required: true},
//     description: {type: String, required: false},
// });
//
// // Base schema
// export const SkillItemBase = model<SkillItem>('SkillItem', SkillItemSchema);
//
// // Discriminators
// export const TextSkillItem = SkillItemBase.discriminator('TextSkillItem', TextSkillItemSchema);
// export const WorkSkillItem = SkillItemBase.discriminator('WorkSkillItem', WorkSkillItemSchema);
// export const LinkSkillItem = SkillItemBase.discriminator('LinkSkillItem', LinkSkillItemSchema);
// export const PhotoSkillItem = SkillItemBase.discriminator('PhotoSkillItem', PhotoSkillItemSchema);
//
//
// // export class SkillItem extends Document {
// //
// //     @Prop({required: true})
// //     order: number;
// // }
//
// //
// // export class Text extends SkillItem {
// //     @Prop({required: true})
// //     text: string;
// // }
// //
// //
// //
// // export class Photo extends SkillItem {
// //     @Prop({required: true})
// //     content: string;
// //     @Prop({required: true})
// //     name: string;
// // }
// //
// //
// // export class Link extends SkillItem {
// //     @Prop({required: true})
// //     link: string;
// //     @Prop({required: false})
// //     description: string;
// // }
// //
// // export const SkillItemSchema = SchemaFactory.createForClass(SkillItem);
// //
// // export const PhotoSchema = SkillItemSchema.discriminator(
// //     SkillItemType.PHOTO,
// //     SchemaFactory.createForClass(Photo),
// // );
// //
// // export const LinkSchema = SkillItemSchema.discriminator(
// //     SkillItemType.LINK,
// //     SchemaFactory.createForClass(Link),
// // );
// //
// // export const TextSchema = SkillItemSchema.discriminator(
// //     SkillItemType.TEXT,
// //     SchemaFactory.createForClass(Text),
// // );
//
// // export type PhotoDocument = Photo & Document;
// // export type LinkDocument = Link & Document;
// // export type TextDocument = Texts & Document;
