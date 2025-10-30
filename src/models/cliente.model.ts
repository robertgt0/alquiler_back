import { Schema, model } from "mongoose";
import { IUser, User } from "./user.model";

export interface ICliente extends IUser {
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

// Discriminador para heredar User
export const Cliente = User.discriminator<ICliente>("Cliente", clienteSchema);
