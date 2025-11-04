import { Document } from 'mongoose';
// Define aquí los tipos/interfaces específicos de este módulo

export interface TeamsysEntity {
  _id?: string;
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

// types/index.ts
export interface UsuarioAttrs {
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  correo: string;
  password?: string | null;
  fotoPerfil: string;
  ubicacion?: { type: 'Point'; coordinates: number[] } | null;
  terminosYCondiciones?: boolean;
  authProvider: 'local' | 'google';
  googleId?: string | null;
  rol: 'requester' | 'provider' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}


// Agrega más tipos según necesites
export interface OtraInterface {
  // ...
}

// Interfaz TypeScript con ubicación tipo Point
export interface UsuarioDocument extends Document {
  nombre: string;
  apellido?: string;
  telefono?: string;
  correo: string;
  password?: string;
  fotoPerfil?: string; // url (imagen)
  ubicacion?: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  terminosYCondiciones: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CrearUsuarioDto {
  nombre: string;
  correo: string;
  telefono?: string;
  password?: string;
  fotoPerfil?:string;
  authProvider?: string;
  terminosYCondiciones: boolean;
}