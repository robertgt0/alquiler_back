import { Schema, model, models, Document } from "mongoose";

export interface CategoryDoc extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, maxlength: 800, default: "" },
  },
  {
    collection: "categories",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const CategoryModel = models.Category ?? model<CategoryDoc>("Category", CategorySchema);
