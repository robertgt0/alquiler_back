// src/models/transaccion.model.ts
import { Schema, model, Types } from "mongoose";

export interface IFactura {
  numero_factura: string;
  monto: number;
}

export interface ITransaccion {
  id_deuda: Types.ObjectId;
  url_pasarela_pagos: string;
  fecha_pago: Date;
  forma_pago: string;
  facturas: IFactura[];
}

const transaccionSchema = new Schema<ITransaccion>({
  id_deuda: { type: Schema.Types.ObjectId, ref: "Deuda", required: true },
  url_pasarela_pagos: { type: String, required: true },
  fecha_pago: { type: Date, required: true },
  forma_pago: { type: String, required: true },
  facturas: [{ numero_factura: String, monto: Number }],
}, { timestamps: true });

export const Transaccion = model<ITransaccion>("Transaccion", transaccionSchema);
