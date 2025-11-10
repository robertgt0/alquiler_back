import { Document } from "mongoose";

export interface IUser extends Document {
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

  rol: 'requester' | 'provider' | 'admin';

  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  twoFactorBackupCodes: string[];

  createdAt: Date;
  updatedAt: Date;
}