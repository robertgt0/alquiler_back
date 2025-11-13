import { Schema, model, Document } from 'mongoose';

export interface IUbicacion extends Document {
  id: number;
  nombre: string;
  posicion: number[];
}

const UbicacionSchema = new Schema<IUbicacion>({
  id: { type: Number, required: true },
  nombre: { type: String, required: true },
  posicion: { type: [Number], required: true }
});

const UbicacionEstaticaModel = model<IUbicacion>('UbicacionEstatica', UbicacionSchema, 'ubicasiones_estaticas');
export default UbicacionEstaticaModel;