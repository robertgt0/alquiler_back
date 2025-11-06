import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  role: "fixer" | "requester" | string;
  city?: string;
  rating?: number;
  reviewsCount?: number;
  avatar?: string;
  summary?: string;
  skills: Types.ObjectId[]; // refs a Job._id
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true, index: true },
    city: String,
    rating: Number,
    reviewsCount: Number,
    avatar: String,
    summary: String,
    skills: [{ type: Schema.Types.ObjectId, ref: "Job", index: true }],
  },
  { timestamps: true, collection: "users" }
);

UserSchema.index({ name: "text" });

export default model<IUser>("User", UserSchema);
