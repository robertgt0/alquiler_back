import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

export interface Usuario1 {
  _id?:string | null;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;

  correo: string;
  password?: string | null;

  fotoPerfil: string;

  ubicacion?: {
    type: 'Point';
    coordinates: number[]; // [lng, lat]
  } | null;

  terminosYCondiciones?: boolean;

  authProvider: 'local' | 'google';
  googleId?: string | null;

  rol: 'requester' | 'provider' | 'admin' | 'fixer';
}

  const PROVIDERS = ['local', 'google'] as const;
  type Provider = typeof PROVIDERS[number];

const userSchema = new Schema(
  {
    nombre: { type: String,
      required: [true, 'El nombre es requerido'], trim: true },
    apellido: { type: String, trim: true },
    telefono: { type: String, trim: true },

    correo: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      // No obligatorio: usuarios de Google no la tienen
    },

    fotoPerfil: {
      type: String, // o String si usas URL
      required: [true, 'La foto de perfil es obligatoria para todos los usuarios'],
    },

    ubicacion: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitud, latitud]
        required: [true, 'La ubicación es obligatoria para todos los usuarios'],
      },
    },

    terminosYCondiciones: { type: Boolean },

    // === OAuth ===
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },

    // === Rol ===
    rol: {
      type: [String],
      default: ['requester'], // todos los nuevos usuarios serán requester
      required: true,
    },
    twoFactorSecret: {
      type: String,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorBackupCodes: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

// Índices
userSchema.index({ ubicacion: '2dsphere' });
userSchema.index({ correo: 1 }, { unique: true });

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;
export default model<User>('User', userSchema, 'users');


// Documento principal: un registro por usuario
const userAuthSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // un documento por usuario
    },

    authProvider: {
      type: [String],
      required: true
    },
    mapaModificacion:{
      type:Number,
      default:3,
      required:true
    },
    historialPassword:{
      type:[String],
      default:[]
    }
  },
  { timestamps: true }
);

export type UserAuth = InferSchemaType<typeof userAuthSchema>;
export type UserAuthDocument = HydratedDocument<UserAuth>;
export const UserAuthModel = model<UserAuth>('UserAuth', userAuthSchema, 'user_auth');
