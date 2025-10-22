import mongoose from "mongoose";

export interface Oferta {
  descripcion: string;
  categoria: string;
  imagen?: Buffer; // 👈 Imagen como binario
  createdAt?: Date;
  updatedAt?: Date;
}

const ofertaSchema = new mongoose.Schema<Oferta>({
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  imagen: { type: Buffer }, // 👈 aquí se guardará la imagen
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export default mongoose.model<Oferta>("Oferta", ofertaSchema);

