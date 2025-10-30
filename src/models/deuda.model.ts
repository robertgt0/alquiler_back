// src/models/deuda.model.ts
import { Schema, model, Types } from "mongoose";

export interface ILineaDetalleDeuda {
  concepto: string;
  cantidad: number;
  costo_unitario: number;
}

export interface IDeuda {
  appkey: string;
  identificador_deuda: string;
  fecha_vencimiento: Date;
  descripcion: string;
  callback_url?: string;
  moneda?: string;
  valor_envio?: number;
  descripcion_envio?: string;
  id_cliente: Types.ObjectId;
  lineas_detalle_deuda: ILineaDetalleDeuda[];
}

const deudaSchema = new Schema<IDeuda>({
  appkey: { type: String, required: true },
  identificador_deuda: { type: String, required: true, unique: true },
  fecha_vencimiento: { type: Date, required: true },
  descripcion: { type: String, required: true },
  callback_url: { type: String },
  moneda: { type: String, default: "BOB" },
  valor_envio: { type: Number, default: 0 },
  descripcion_envio: { type: String },
  id_cliente: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lineas_detalle_deuda: [{ concepto: String, cantidad: Number, costo_unitario: Number }],
}, { timestamps: true });

export const Deuda = model<IDeuda>("Deuda", deudaSchema);
