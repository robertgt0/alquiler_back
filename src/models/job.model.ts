import { Schema, model, Document } from "mongoose";

export interface IJob extends Document {
  name: string;
}

const JobSchema = new Schema<IJob>(
  {
    name: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true, collection: "jobs" }
);

export default model<IJob>("Job", JobSchema);
