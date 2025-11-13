import { Schema, model, Document } from 'mongoose';

// Interfaz para TypeScript (define la estructura del objeto)
// Esto debe coincidir con los datos en categories.data.ts
export interface ICategory extends Document {
  name: string;
  description: string;
  iconUrl?: string;
}

// Esquema para Mongoose (define las reglas para la BD)
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      unique: true, // No permite categorías con el mismo nombre
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    iconUrl: {
      type: String,
      trim: true,
      default: null, // Puedes poner una URL de un icono por defecto si quieres
    },
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    versionKey: false, // Quita el campo __v de Mongoose
  }
);

// Crear y exportar el modelo
const Category = model<ICategory>('Category', categorySchema);
export default Category;