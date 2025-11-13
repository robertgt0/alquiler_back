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

const TrabajoSchema = new Schema<ITrabajo>(
  {
    id_cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    id_proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },
    fecha: { type: String, required: true },
    servicio: { type: String, required: true },
    hora_inicio: { type: String, required: true },
    hora_fin: { type: String, required: true },
    costo: { type: Number, required: true },
    descripcion_trabajo: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Pendiente", "Confirmado", "Cancelado", "Terminado"],
      default: "Pendiente",
    },
    // ✅ Valor por defecto seguro para evitar validación fallida
    numero_estrellas: { type: Number, min: 1, max: 5, default: 1 },
    comentario_calificacion: { type: String },
    ubicacion: { type: String },
    justificacion_cancelacion: { type: String },
    cancelado_por: { type: String }, // "cliente" o "proveedor"
  },
  { timestamps: true }
);

const TrabajoModel = mongoose.model<ITrabajo>("Trabajo", TrabajoSchema);

export default TrabajoModel;
