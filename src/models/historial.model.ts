import { Schema, model, Document, Types } from "mongoose";

export interface IHistorial extends Document {
  id_usuario: Types.ObjectId;
  termino: string;
  terminoOriginal: string;
  fecha: Date;
}

const historialSchema = new Schema<IHistorial>(
  {
    id_usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    termino: { type: String, required: true },
    terminoOriginal: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Historial = model<IHistorial>("Historial", historialSchema);
