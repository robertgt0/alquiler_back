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

// Agrega más tipos según necesites
export interface OtraInterface {
  // ...
}

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


export interface CrearUsuarioDto {
  nombre: string;
  correoElectronico: string;
  telefono?: string;
  password?: string;
  terminosYCondiciones: boolean;
}