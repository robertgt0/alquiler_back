import mongoose, { Schema, Document } from "mongoose";

export interface ITrabajo extends Document {
  id_cliente: mongoose.Schema.Types.ObjectId;
  id_proveedor: mongoose.Schema.Types.ObjectId;
  fecha: string;
  servicio: string;
  hora_inicio: string;
  hora_fin: string;
  costo: number;
  descripcion_trabajo: string;
  estado: string;
  numero_estrellas?: number;
  comentario_calificacion?: string;
  ubicacion?: string;
  justificacion_cancelacion?: string;
  cancelado_por?: string;
}

const TrabajoSchema = new Schema<ITrabajo>({
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente", // referencia al modelo Cliente
    required: true
  },
  id_proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proveedor", // referencia al modelo Proveedor
    required: true
  },
  fecha: { type: String, required: true },
  servicio:{type: String, required: true},
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  costo: { type: Number, required: true },
  descripcion_trabajo: { type: String, required: true },
  estado: {
    type: String,
    enum: ["pendiente", "en_proceso", "completado", "cancelado"],
    default: "pendiente"
  },
  numero_estrellas: { type: Number, min: 1, max: 5 },
  comentario_calificacion: { type: String },
  ubicacion: { type: String },
  justificacion_cancelacion: { type: String },
  cancelado_por: { type: String } // puede ser "cliente" o "proveedor"
}, { timestamps: true });

const TrabajoModel = mongoose.model<ITrabajo>("Trabajo", TrabajoSchema);

export default TrabajoModel;