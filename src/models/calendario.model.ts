import { Schema, model, Document, Types } from "mongoose";

export interface ICalendario extends Document {
  proveedor: Types.ObjectId;
  fechas_ocupadas?: Date[];
  fechas_disponibles?: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const calendarioSchema = new Schema<ICalendario>(
  {
    proveedor: { type: Schema.Types.ObjectId, ref: "ProveedorInfo", required: true },
    fechas_ocupadas: [Date],
    fechas_disponibles: [Date],
  },
  { timestamps: true }
);

export const Calendario = model<ICalendario>("Calendario", calendarioSchema);
