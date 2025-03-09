import { Document, Schema } from "mongoose";
import { User } from "../../user/entities/user.entity";
import * as paginate from "mongoose-paginate-v2";

export enum PostType {
  OFFER = "OFFER", // Explicitly set string values
  REQUEST = "REQUEST",
}

// Define GeoJSON Point interface
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Post extends Document {
  title: string;
  content: any;
  category: string;
  tags: string[];
  date_created: Date;
  date_modified: Date;
  user: User;
  type: PostType;
  status: boolean;
  location: GeoPoint;
  address: string;
}

const PostSchema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true }, // Allows flexible data (JSON/HTML)
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  date_created: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: Boolean, required: true, default: false },
  type: {
    type: String, // Specify the data type as String
    required: true,
    enum: Object.values(PostType), // Ensure only valid enum values are allowed
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v: number[]) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates. Must be [longitude, latitude] with valid ranges.'
      }
    }
  },
  address: { type: String, required: true }
});

PostSchema.plugin(paginate);

PostSchema.index({
  title: "text",
  content: "text",
  address: "text"
});

// Geospatial index for location queries
PostSchema.index({ location: "2dsphere" });

export { PostSchema };

// DTO assembler
