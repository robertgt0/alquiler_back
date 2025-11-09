import { Schema, model, Document, Types } from "mongoose";

export interface IUbicacionProvider {
  lat: number;
  lng: number;
  ciudad: string;
  direccion_detallada: string;
}

export interface IOfertaTrabajo extends Document {
  proveedor: Types.ObjectId;
  servicio: Types.ObjectId;
  nombre_oferta: string;
  descripcion: string;
  ubicacionProvider: IUbicacionProvider;
  verificado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ofertaTrabajoSchema = new Schema<IOfertaTrabajo>(
  {
    proveedor: { type: Schema.Types.ObjectId, ref: "ProveedorInfo", required: true },
    servicio: { type: Schema.Types.ObjectId, ref: "Servicio", required: true },
    nombre_oferta: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubicacionProvider: {
      lat: Number,
      lng: Number,
      ciudad: String,
      direccion_detallada: String,
    },
    verificado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OfertaTrabajo = model<IOfertaTrabajo>("OfertaTrabajo", ofertaTrabajoSchema);
