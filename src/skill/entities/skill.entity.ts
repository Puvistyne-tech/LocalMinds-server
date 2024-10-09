import { Document, Schema } from "mongoose";
import { User } from "../../user/entities/user.entity";
import * as paginate from "mongoose-paginate-v2";

export enum SkillType {
  OFFER = "OFFER", // Explicitly set string values
  REQUEST = "REQUEST",
}

export interface Skill extends Document {
  title: string;
  content: any;
  category: string;
  tags: string[];
  date_created: Date;
  date_modified: Date;
  user: User;
  type: SkillType;
  status: boolean;
}

const SkillSchema = new Schema<Skill>({
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
    enum: Object.values(SkillType), // Ensure only valid enum values are allowed
  },
});

SkillSchema.plugin(paginate);

SkillSchema.index({
  title: "text",
  content: "text",
});

export { SkillSchema };

// DTO assembler
