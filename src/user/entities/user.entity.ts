import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema, Types} from "mongoose";
import {PrimaryGeneratedColumn} from "typeorm";


export interface User extends Document {
    // id: Types.UUID;
    username: string;
    password: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    bio: string;
    avatar: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: Date;
    modified_at: Date;
    connections: User[];
    reputations: String[];
}

const UserSchema = new Schema<User>({
    // id: {type: Types.UUID, required: true, index: true, unique: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    first_name: {type: String, required: false},
    last_name: {type: String, required: false},
    bio: {type: String, required: false},
    avatar: {type: String, required: false},
    is_verified: {type: Boolean, default: true},
    is_active: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now},
    reputations: {type: [String], required: false},
    modified_at: {type: Date, default: Date.now},
    connections: {type: [Schema.Types.ObjectId], ref: 'User'},
})

UserSchema.index({
    username: 'text',
    first_name: 'text',
    last_name: 'text',
})

export {UserSchema}


// @Schema()
// export class User extends Document {
//     @PrimaryGeneratedColumn("uuid")
//     _id: string;
//
//     @Prop({unique: true})
//     username: string;
//
//     @Prop({unique: true})
//     email: string;
//
//     @Prop()
//     phone: string;
//
//     @Prop()
//     password: string;
//
//     @Prop({nullable: true})
//     firstName: string;
//
//     @Prop({nullable: true})
//     lastName: string;
//
//     @Prop({nullable: true})
//     bio: string;
//
//     @Prop({nullable: true})
//     avatar: string;
//
//     @Prop({default: false})
//     isVerified: boolean;
//
//     @Prop({type: [{type: Types.ObjectId, ref: 'Skill'}]})
//     skills: string[];
//     //
//     @Prop({type: [{type: Types.ObjectId, ref: 'User'}]})
//     connections: string[];
//
//     @Prop({type: Map, of: String})
//     reputation: Map<string, string>; // Map of category to badge or rating
//
//     @Prop({default: Date.now})
//     created_at: Date;
// }


// export const UserSchema = SchemaFactory.createForClass(User);
