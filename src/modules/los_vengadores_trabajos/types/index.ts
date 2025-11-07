//src/modules/los_vengadores_trabajos/types/index.ts
// Define aquí los tipos/interfaces específicos de este módulo

export interface EjemploEntity {
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

//types para la HU2
export interface HorarioDisponible{
  horaInicio: string;
  horaFin: string;
  costoHora: number;
}
export interface DiaDisponibilidad{
  fecha: string; // Formato YYYY-MM-DD
  horarios: HorarioDisponible[];
}
///


