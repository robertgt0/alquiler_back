import { Schema, model, Document, Types } from "mongoose";

export interface IHorario {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface IMetodoPago {
  tipo: string;
  detalle?: string;
}

export interface IUbicacion {
  lat: number;
  lng: number;
  ciudad: string;
  direccion_detallada: string;
}

export interface IProveedorInfo extends Document {
  usuario: Types.ObjectId;
  servicios?: Types.ObjectId[];
  ubicacion: IUbicacion;
  direccion: string;
  horarios?: IHorario[];
  calendario?: Types.ObjectId;
  rating: number;
  trabajos_completados: number;
  metodos_pago?: IMetodoPago[];
  createdAt: Date;
  updatedAt: Date;
}

const proveedorInfoSchema = new Schema<IProveedorInfo>(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    servicios: [{ type: Schema.Types.ObjectId, ref: "Servicio" }],
    ubicacion: {
      lat: Number,
      lng: Number,
      ciudad: String,
      direccion_detallada: String,
    },
    direccion: { type: String, required: true },
    horarios: [
      {
        dia: String,
        hora_inicio: String,
        hora_fin: String,
      },
    ],
    calendario: { type: Schema.Types.ObjectId, ref: "Calendario" },
    rating: { type: Number, default: 0 },
    trabajos_completados: { type: Number, default: 0 },
    metodos_pago: [
      {
        tipo: String,
        detalle: String,
      },
    ],
  },
  { timestamps: true }
);

export const ProveedorInfo = model<IProveedorInfo>("ProveedorInfo", proveedorInfoSchema);
export default ProveedorInfo;