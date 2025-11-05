import { Schema, model, Document, Types } from "mongoose";
import { IUser, User } from "./user.model";

export interface ICuenta extends IUser {
  saldo: number;
  propietario: Types.ObjectId;
  nroCuenta: string;
  estado: "activa" | "suspendida" | "cerrada";
}

const cuentaSchema = new Schema<ICuenta>(
  {
    saldo: { type: Number, required: true, default: 0 },
    propietario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nroCuenta: { type: String, required: true, unique: true },
    estado: { type: String, enum: ["activa", "suspendida", "cerrada"], default: "activa" },
  },
  { timestamps: true }
);

export const Cuenta = model<ICuenta>("Cuenta", cuentaSchema);
