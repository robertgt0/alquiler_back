// src/modules/los_vengadores_trabajos/models/trabajo.model.ts

// ahora este tipo se puede importar desde otros archivos.
export type TrabajoStatus = 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Terminado';

// Esta es la estructura que nuestra API devolverá al frontend
export interface ITrabajoCompleto {
  _id: string;
  proveedor: {
    nombre: string;
    id: string;
  };
  cliente: {
    nombre: string;
    id: string;
  };
  fecha: string;
  horaInicio: string;
  horaFin: string;
  servicio?: string;
  estado: TrabajoStatus; // ahora puede usar el tipo reutilizable
}

// esta es la estructura de como se guarda en la base de datos
export interface ITrabajoSolicitado {
  _id: string;
  id_proveedor: string;
  id_cliente: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: TrabajoStatus; // ahora puede usar el tipo reutilizable
}