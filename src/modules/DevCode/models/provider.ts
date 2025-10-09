import { Schema, model, Document } from "mongoose";

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
  ocupado: string[];
}

export interface Provider extends Document {
  usuarioId: string;
  servicios: string[];
  descripcion: string;
  ubicacion: { lat: number; lng: number };
  horario: Horario[];
  rating: number;
  trabajosCompletados: number;
}

const horarioSchema = new Schema<Horario>({
  dia: { type: String, required: true },
  inicio: { type: String, required: true },
  fin: { type: String, required: true },
  ocupado: { type: [String], default: [] },
});

const providerSchema = new Schema<Provider>({
  usuarioId: { type: String, required: true },
  servicios: { type: [String], required: true },
  descripcion: { type: String, required: true },
  ubicacion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  horario: { type: [horarioSchema], required: true },
  rating: { type: Number, required: true },
  trabajosCompletados: { type: Number, default: 0 },
});

export default model<Provider>("Provider", providerSchema);
