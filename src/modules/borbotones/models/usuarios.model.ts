import { Schema, model, Document, Model } from "mongoose";

export interface IUsuario extends Document {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;
  fecha_registro: Date;
  ciudad: { id_ciudad: number; nombre?: string; codigo_postal?: string };
  especialidades?: Array<{ id_especialidad: number; nombre?: string }>;
  servicios?: Array<{ id_servicio: number; nombre?: string }>;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    id_usuario: { type: Number, required: true, unique: true, index: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    activo: { type: Boolean, default: true },
    fecha_registro: { type: Date, required: true },
    ciudad: {
      id_ciudad: { type: Number, required: true, index: true },
      nombre: String,
      codigo_postal: String,
    },
    especialidades: [{ id_especialidad: Number, nombre: String }],
    servicios: [{ id_servicio: Number, nombre: String }],
  },
  { collection: "usuarios", timestamps: false }
);

// (opcional) índice útil
UsuarioSchema.index({ "ciudad.nombre": 1 });

const Usuario: Model<IUsuario> = model<IUsuario>("Usuario", UsuarioSchema);
export default Usuario;
