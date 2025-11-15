import { Schema, model, Document } from "mongoose";

export interface ICity extends Document {
  id_ciudad: number;
  nombre: string;
  codigo_postal: string;
  fecha_creacion: Date;
}

const CitySchema = new Schema<ICity>(
  {
    id_ciudad: { type: Number, required: true, unique: true, index: true },
    nombre: { type: String, required: true, index: true },
    codigo_postal: { type: String, required: true },
    fecha_creacion: { type: Date, required: true },
  },
  { collection: "ciudades", timestamps: false }
);

export default model<ICity>("City", CitySchema);
