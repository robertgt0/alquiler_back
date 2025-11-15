import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  nombre: string;
  apellido?: string;
  telefono?: string;
  correo: string;
  password?: string;
  contraseña?: string;
  fotoPerfil?: string;
  foto_perfil?: string;
  ubicacion?: {
    type: "Point";
    coordinates: [number, number];
  };
  terminosYCondiciones?: boolean;
  authProvider?: string;
  googleId?: string;
  rol?: "cliente" | "proveedor" | "admin" | string;
  roles?: string[];
  twoFactorSecret?: string;
  twoFactorEnabled?: boolean;
  twoFactorBackupCodes?: string[];
  fecha_creacion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    nombre: { type: String, required: true },
    apellido: { type: String },
    telefono: { type: String },
    correo: { type: String, required: true, unique: true, trim: true },

    password: { type: String, select: false },
    contraseña: { type: String, select: false },

    fotoPerfil: { type: String },
    foto_perfil: { type: String },

    ubicacion: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },

    terminosYCondiciones: { type: Boolean, default: false },
    authProvider: { type: String, default: "local" },
    googleId: { type: String },

    rol: {
      type: String,
      enum: ["cliente", "proveedor", "admin"],
      default: "cliente",
    },

    roles: {
      type: [String],
      enum: ["cliente", "fixer", "admin"],
      default: undefined,
    },

    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorBackupCodes: [{ type: String }],

    fecha_creacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.index({ ubicacion: "2dsphere" });

export const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
