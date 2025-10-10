import mongoose, { Schema, Document } from 'mongoose';

// Interfaz TypeScript con ubicación tipo Point
export interface UsuarioDocument extends Document {
  nombre: string;
  apellido?: string;
  telefono: string;
  correoElectronico: string;
  password: string;
  fotoPerfil?: Buffer; // Binario (imagen)
  ubicacion?: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  terminosYCondiciones: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Esquema de Mongoose
const usuarioSchema = new Schema<UsuarioDocument>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    apellido: {
      type: String,
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
    },
    correoElectronico: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    fotoPerfil: {
      type: Buffer, // 👈 binario (imagen)
    },
    ubicacion: {
      type: {
        type: String,
        enum: ['Point'], // tipo GeoJSON
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitud, latitud]
        default: [0, 0],
      },
    },
    terminosYCondiciones: {
      type: Boolean,
      required: [true, 'Debes aceptar los términos y condiciones'],
    },
  },
  {
    timestamps: true,
  }
);

// Índice geoespacial 2dsphere para búsquedas por radio
usuarioSchema.index({ ubicacion: '2dsphere' });

export default mongoose.model<UsuarioDocument>('Usuario', usuarioSchema);
