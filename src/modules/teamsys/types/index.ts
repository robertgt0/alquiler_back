import { Document } from 'mongoose';

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

// Tipos para autenticación con Google
export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    nombre: string;
    correo: string;
    fotoPerfil?: string;
    terminosYCondiciones: boolean;
  };
  expiresAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Tipos existentes
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
  fotoPerfil?: any;
  terminosYCondiciones: boolean;
}