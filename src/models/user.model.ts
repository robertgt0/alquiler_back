import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  nombre: string;
  apellido?: string;
  telefono?: string;
  correo: string;
  password?: string;
  fotoPerfil: string;
  ubicacion: {
    type: "Point";
    coordinates: [number, number];
  };
  terminosYCondiciones?: boolean;
  authProvider?: string;
  googleId?: string;
  rol: string[];
  twoFactorSecret?: string;
  twoFactorEnabled?: boolean;
  twoFactorBackupCodes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    nombre: { type: String, required: true },
    apellido: { type: String },
    telefono: { type: String },
    correo: { type: String, required: true, unique: true },
    password: { type: String },
    fotoPerfil: { type: String, required: true },

    ubicacion: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    terminosYCondiciones: { type: Boolean, default: false },
    authProvider: { type: String, default: "local" },
    googleId: { type: String },

    rol: {
      type: [String],
      enum: ["cliente", "fixer", "admin"],
      required: true,
    },

    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorBackupCodes: [{ type: String }],
  },
  { timestamps: true } // genera createdAt y updatedAt automáticos
);

userSchema.index({ ubicacion: "2dsphere" }); // índice geoespacial

export const User = model<IUser>("User", userSchema);
