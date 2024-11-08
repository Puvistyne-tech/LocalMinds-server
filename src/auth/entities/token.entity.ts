import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ 
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})
export class Token extends Document {
    @ApiProperty({ description: 'User reference' })
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User | MongooseSchema.Types.ObjectId;

    @ApiProperty({ description: 'Refresh token string' })
    @Prop({ required: true })
    refresh_token: string;

    @ApiProperty({ description: 'Token expiration date' })
    @Prop({ required: true })
    expires_at: Date;

    @ApiProperty({ description: 'Token revocation status' })
    @Prop({ default: false })
    is_revoked: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Add indexes
TokenSchema.index({ user: 1 });
TokenSchema.index({ refresh_token: 1 });
TokenSchema.index({ expires_at: 1 });