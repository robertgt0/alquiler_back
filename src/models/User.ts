// src/models/User.ts
import { Schema, model, Document } from "mongoose";
import { IUser } from "../types";

export interface IUserDocument extends Document, IUser {}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    ci: { type: String }
  },
  { timestamps: true }
);

export const User = model<IUserDocument>("User", userSchema);
