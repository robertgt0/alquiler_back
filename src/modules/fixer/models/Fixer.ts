import { Schema, model, Types } from "mongoose";

const LocationSchema = new Schema({
  lat: { type: Number, required: true, min: -90, max: 90 },
  lng: { type: Number, required: true, min: -180, max: 180 },
  address: { type: String, trim: true, maxlength: 255 }
}, { _id: false });

const FixerSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  location: { type: LocationSchema, required: true }
}, { timestamps: true });

export default model("Fixer", FixerSchema);
