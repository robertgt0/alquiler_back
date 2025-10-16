// src/modules/ofertas/services/ofertas.service.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

// Obtener URI desde .env
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  throw new Error("❌ No se encontró la variable de entorno MONGODB_URI");
}

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Definición del esquema y modelo de Oferta
export interface Oferta {
  descripcion: string;
  categoria: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ofertaSchema = new mongoose.Schema<Oferta>({
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

const OfertaModel = mongoose.model<Oferta>("Oferta", ofertaSchema);

// Función para crear una oferta
export async function crearOferta(oferta: Oferta) {
  const nuevaOferta = new OfertaModel(oferta);
  return await nuevaOferta.save();
}

// Función para obtener todas las ofertas
export async function obtenerOfertas() {
  return await OfertaModel.find();
}
