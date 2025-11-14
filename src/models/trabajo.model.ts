import { Schema, model, Document, Types } from "mongoose";

export interface ITrabajo extends Document {
  fixer_id: Types.ObjectId;
  id_cliente: Types.ObjectId;
  descripcion: string;
  servicio?: string;
  estado: "pendiente" | "en_progreso" | "terminado" | "cancelado";
  monto_a_pagar: number;
  fecha_creacion: Date;
  fecha_pago?: Date;
  hora_inicio?: string;
  hora_fin?: string;
  ubicacion?: string;
  numero_estrellas?: number;
  comentario_calificacion?: string;
  justificacion_cancelacion?: string;
  cancelado_por?: string;
}

const trabajoSchema = new Schema<ITrabajo>(
  {
    fixer_id: { type: Schema.Types.ObjectId, ref: "Fixer", required: true },
    id_cliente: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
    descripcion: { type: String, required: true },
    servicio: { type: String },
    estado: {
      type: String,
      enum: ["pendiente", "en_progreso", "terminado", "cancelado"],
      default: "pendiente",
    },
    monto_a_pagar: { type: Number, required: true },
    fecha_creacion: { type: Date, default: Date.now },
    fecha_pago: { type: Date },
    hora_inicio: { type: String },
    hora_fin: { type: String },
    ubicacion: { type: String },
    numero_estrellas: { type: Number, min: 1, max: 5 },
    comentario_calificacion: { type: String },
    justificacion_cancelacion: { type: String },
    cancelado_por: { type: String },
  },
  { timestamps: true }
);

export const Trabajo = model<ITrabajo>("Trabajo", trabajoSchema);
