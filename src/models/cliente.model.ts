// src/models/cliente.model.ts
import { Schema } from "mongoose";
import { User } from "@models/user.model"; // ruta relativa correcta
import { IUserDocument } from "./user.model";

export interface ICliente extends IUserDocument {
  ci: string;
  razon_social: string;
  nit: string;
  emite_factura: boolean;
}

const clienteSchema = new Schema<ICliente>({
  ci: { type: String, required: true },
  razon_social: { type: String, required: true },
  nit: { type: String, required: true },
  emite_factura: { type: Boolean, required: true }
});

// 🔥 Crea el discriminador correctamente
export const Cliente = User.discriminator<ICliente>("Cliente", clienteSchema);
