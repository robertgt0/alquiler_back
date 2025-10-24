import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("❌ No se encontró MONGODB_URI");

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

export interface Oferta {
  id?: string;           // id único
  descripcion: string;
  categoria: string;
  imagen?: Buffer;       // se guardará en binario
  createdAt?: Date;
  updatedAt?: Date;
}

const ofertaSchema = new mongoose.Schema<Oferta>({
  id: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  imagen: { type: Buffer }, 
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

const OfertaModel = mongoose.model<Oferta>("Oferta", ofertaSchema);

// 🔹 Crear oferta
export async function crearOferta(oferta: Oferta) {
  const nuevaOferta = new OfertaModel(oferta);
  return await nuevaOferta.save();
}

// 🔹 Obtener todas las ofertas
export async function obtenerOfertas() {
  return await OfertaModel.find();
}

// 🔹 Eliminar oferta por id
export async function eliminarOferta(id: string) {
  const result = await OfertaModel.findOneAndDelete({ id });
  return result;
}

// 🔹 Actualizar oferta por id
export async function actualizarOferta(id: string, datos: Partial<Oferta>) {
  const ofertaEditada = await OfertaModel.findOneAndUpdate(
    { id },
    { ...datos, updatedAt: new Date() },
    { new: true } // devuelve el documento actualizado
  );
  return ofertaEditada;
}
