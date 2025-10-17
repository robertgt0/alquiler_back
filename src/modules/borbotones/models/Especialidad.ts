import mongoose, { Schema, Document, Model } from 'mongoose'; // Importa Mongoose y los tipos necesarios para definir esquemas y modelos

// Define una interfaz (tipo de datos) para las especialidades en la base de datos
export interface IEspecialidad extends Document {
  id_especialidad: number; // Identificador numérico único de la especialidad
  nombre: string; // Nombre de la especialidad
  fecha_creacion: Date; // Fecha en la que se creó el registro
}

// Define el esquema de Mongoose que describe cómo se estructura la colección "especialidades"
const EspecialidadSchema = new Schema<IEspecialidad>({
  id_especialidad: { type: Number, required: true }, // Campo numérico obligatorio
  nombre: { type: String, required: true }, // Campo de texto obligatorio
  fecha_creacion: { type: Date, required: true } // Campo de fecha obligatorio
});

// Crea el modelo "Especialidad" basado en el esquema definido
// Si ya existe un modelo con ese nombre en Mongoose, lo reutiliza (para evitar duplicados)
const Especialidad: Model<IEspecialidad> =
  mongoose.models.Especialidad || // Usa el modelo existente si ya fue creado
  mongoose.model<IEspecialidad>('Especialidad', EspecialidadSchema, 'especialidades'); // Si no, crea uno nuevo con la colección 'especialidades'

// Exporta el modelo para que pueda ser utilizado en controladores o servicios
export default Especialidad;
