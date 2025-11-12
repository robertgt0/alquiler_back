import { Schema, model, Document, Types } from "mongoose";

export interface INotificacion extends Document {
  usuario: Types.ObjectId;
  titulo_notificacion: string;
  mensaje: string;
  datetime: Date;
  estado: "pendiente" | "leída" | "archivada";
  prioridad?: "alta" | "media" | "baja";
  tipo?: "info" | "alerta" | "sistema";
  canal?: "email" | "push" | "sms";
  createdAt: Date;
  updatedAt: Date;
}

const notificacionSchema = new Schema<INotificacion>(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    titulo_notificacion: { type: String, required: true },
    mensaje: { type: String, required: true },
    datetime: { type: Date, required: true },
    estado: { type: String, required: true, enum: ["pendiente", "leída", "archivada"] },
    prioridad: { type: String, enum: ["alta", "media", "baja"] },
    tipo: { type: String, enum: ["info", "alerta", "sistema"] },
    canal: { type: String, enum: ["email", "push", "sms"] },
  },
  { timestamps: true }
);

export const Notificacion = model<INotificacion>("Notificacion", notificacionSchema);
