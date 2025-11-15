import { Schema, model, models, Document } from "mongoose";

export type PaymentMethod = "card" | "qr" | "cash";

export type Location = {
  lat: number;
  lng: number;
  address?: string;
};

export type PaymentAccount = {
  holder: string;
  accountNumber: string;
};

export type FixerSkill = {
  categoryId: string;
  customDescription?: string;
};

const LocationSchema = new Schema<Location>(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    address: { type: String, trim: true, maxlength: 255 },
  },
  { _id: false }
);

const PaymentAccountSchema = new Schema<PaymentAccount>(
  {
    holder: { type: String, trim: true, maxlength: 120 },
    accountNumber: { type: String, trim: true, maxlength: 40 },
  },
  { _id: false }
);

const FixerSkillSchema = new Schema<FixerSkill>(
  {
    categoryId: { type: String, required: true, trim: true },
    customDescription: { type: String, trim: true, maxlength: 800 },
  },
  { _id: false }
);

export interface FixerDoc extends Document {
  fixerId: string;
  userId: string;
  ci: string;
  name?: string;
  city?: string;
  photoUrl?: string;
  whatsapp?: string;
  bio?: string;
  location?: Location;
  categories: string[];
  skills: FixerSkill[];
  paymentMethods: PaymentMethod[];
  paymentAccounts: Partial<Record<PaymentMethod, PaymentAccount>>;
  termsAccepted: boolean;
  jobsCount: number;
  ratingAvg: number;
  ratingCount: number;
  memberSince?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FixerSchema = new Schema<FixerDoc>(
  {
    fixerId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    ci: { type: String, required: true, unique: true },
    name: { type: String, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 120 },
    photoUrl: { type: String, trim: true },
    whatsapp: { type: String, trim: true, maxlength: 32 },
    bio: { type: String, trim: true, maxlength: 600 },
    location: { type: LocationSchema, required: false },
    categories: { type: [String], default: [] },
    paymentMethods: {
      type: [String],
      enum: ["card", "qr", "cash"],
      default: [],
    },
    skills: { type: [FixerSkillSchema], default: [] },
    paymentAccounts: {
      type: Map,
      of: PaymentAccountSchema,
      default: {},
    },
    termsAccepted: { type: Boolean, default: false },
    jobsCount: { type: Number, default: 0, min: 0 },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    memberSince: { type: Date },
  },
  {
    timestamps: true,
    collection: "fixers",
  }
);

FixerSchema.set("toJSON", { virtuals: true, versionKey: false });
FixerSchema.set("toObject", { virtuals: true, versionKey: false });

// Usa nombres unicos para no colisionar con otros modelos `Fixer` definidos por otros equipos.
const FIXER_MODEL_NAME = "FixerProfile";
const FIXER_COLLECTION_NAME = "fixer_profiles";

export const FixerModel =
  models[FIXER_MODEL_NAME] ?? model<FixerDoc>(FIXER_MODEL_NAME, FixerSchema, FIXER_COLLECTION_NAME);

