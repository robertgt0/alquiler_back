import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es requerido'], trim: true },
    apellido: { type: String, trim: true },
    telefono: { type: String, trim: true },
    correoElectronico: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, minlength: [6, 'La contraseña debe tener al menos 6 caracteres'] },
    fotoPerfil: { type: Buffer }, // binario
    ubicacion: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [long, lat]
    },
    terminosYCondiciones: { type: Boolean, required: [true, 'Debes aceptar los términos y condiciones'] },
  },
  { timestamps: true }
);

// índice geoespacial
usuarioSchema.index({ ubicacion: '2dsphere' });

export type Usuario = InferSchemaType<typeof usuarioSchema>;
export type UsuarioDocument = HydratedDocument<Usuario>;

export default model<Usuario>('Usuario', usuarioSchema, 'usuarios');
