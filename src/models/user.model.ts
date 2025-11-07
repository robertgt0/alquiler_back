import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  contraseña: string;
  foto_perfil?: string;
  rol: "cliente" | "proveedor" | "admin";
  fecha_creacion: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    contraseña: { type: String, required: true, select: false },
    foto_perfil: { type: String },
    rol: { type: String, required: true, enum: ["cliente", "proveedor", "admin"] },
    fecha_creacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
