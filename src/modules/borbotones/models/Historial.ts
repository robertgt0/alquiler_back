// Importamos las dependencias necesarias desde Mongoose
import mongoose, { Schema, Document, Model } from 'mongoose';

// 🔹 Interfaz TypeScript que define la estructura que tendrá cada documento del historial
// Esto asegura que cada registro de historial tenga un 'termino' y una 'fecha'
export interface IHistorial extends Document {
  termino: string; // palabra o texto buscado por el usuario
  fecha: Date;     // fecha exacta en la que se realizó la búsqueda
}

// 🔹 Definimos el esquema de Mongoose (estructura en la base de datos)
const HistorialSchema = new Schema<IHistorial>({
  // El término buscado por el usuario (por ejemplo "electricidad")
  termino: { type: String, required: true },

  // Fecha en la que se guarda automáticamente el registro (por defecto ahora mismo)
  fecha: { type: Date, default: Date.now }
});

// 🔹 Creamos el modelo (representa la colección en MongoDB)
// mongoose.model(nombre, esquema, nombre_colección)
const Historial: Model<IHistorial> =
  mongoose.models.Historial || mongoose.model<IHistorial>('Historial', HistorialSchema, 'historial');

// 🔹 Exportamos el modelo para poder usarlo en otros archivos (services, controllers, etc.)
export default Historial;

