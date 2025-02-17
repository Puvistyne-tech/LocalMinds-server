import { Schema, Document, Types } from "mongoose";
import { ApiProperty } from '@nestjs/swagger';

export class User extends Document {
    @ApiProperty({ description: 'MongoDB ObjectId' })
    _id: Types.ObjectId;

    @ApiProperty({ example: 'johndoe', description: 'Unique username' })
    username: string;

    @ApiProperty({ description: 'Hashed password' })
    password: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    email: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    phone: string;

    @ApiProperty({ example: 'John', description: 'First name' })
    firstname: string;

    @ApiProperty({ example: 'Doe', description: 'Last name' })
    lastname: string;

    @ApiProperty({ description: 'Bio' })
    bio: string;

    @ApiProperty({ description: 'Avatar URL' })
    avatar: string;

    @ApiProperty({ description: 'Email verification status' })
    is_verified: boolean;

    @ApiProperty({ description: 'Account active status' })
    is_active: boolean;

    @ApiProperty({ description: 'Account creation date' })
    created_at: Date;

    @ApiProperty({ description: 'Last modification date' })
    modified_at: Date;

    @ApiProperty({ description: 'Connections' })
    connections: Types.ObjectId[];

    @ApiProperty({ description: 'Reputations' })
    reputations: String[];

    @ApiProperty({ description: 'Reset password token' })
    reset_password_token: string;

    @ApiProperty({ description: 'Reset password expiration date' })
    reset_password_expires: Date;

    @ApiProperty({ description: 'Email verification status' })
    is_email_verified: boolean;

    @ApiProperty({ description: 'User roles' })
    roles: string[];

    @ApiProperty({ description: 'Verification token' })
    verification_token: string;

    @ApiProperty({ description: 'Verification expiration date' })
    verification_expires: Date;

    @ApiProperty({ description: 'Username changes count' })
    username_changes_count: number;

    @ApiProperty({ description: 'Email change token' })
    email_change_token: string;

    @ApiProperty({ description: 'Email change expiration date' })
    email_change_expires: Date;

    @ApiProperty({ description: 'New email' })
    new_email: string;

    @ApiProperty({ description: 'Email change confirmed old' })
    email_change_confirmed_old: boolean;
}

const UserSchema = new Schema<User>(
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        phone: {type: String, required: true},
        firstname: {type: String, required: false},
        lastname: {type: String, required: false},
        bio: {type: String, required: false},
        avatar: {type: String, required: false},
        is_verified: {type: Boolean, default: false},
        is_active: {type: Boolean, default: true},
        connections: [{type: Schema.Types.ObjectId, ref: 'User'}],
        reputations: [{type: String}],
        reset_password_token: {type: String, required: false},
        reset_password_expires: {type: Date, required: false},
        is_email_verified: {type: Boolean, default: false},
        roles: { type: [String], default: ['user'] },
        verification_token: {type: String, required: false},
        verification_expires: {type: Date, required: false},
        username_changes_count: {type: Number, default: 0},
        email_change_token: {type: String, required: false},
        email_change_expires: {type: Date, required: false},
        new_email: {type: String, required: false},
        email_change_confirmed_old: {type: Boolean, default: false},
    }, 
    {
        timestamps: { 
            createdAt: 'created_at', 
            updatedAt: 'modified_at' 
        },
        _id: true,  // Ensure MongoDB handles _id
        id: false,  // Disable Mongoose's id virtual
        versionKey: false // Disable the version key
    }
);

// Clear all indexes first
UserSchema.clearIndexes();

// Add text search index
UserSchema.index({
    username: 'text',
    firstname: 'text',
    lastname: 'text',
});

// Add unique indexes
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

// Transform the document when converting to JSON
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export { UserSchema };
