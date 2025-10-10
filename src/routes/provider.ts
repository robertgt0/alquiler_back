import { Types } from 'mongoose';

export interface IService {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  duracion: number;
}

export interface IUbicacion {
  direccion: string;
  coordenadas: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
}

export interface IHorario {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface ICalendario {
  fechasNoDisponibles: Date[];
  citas: {
    clienteId: Types.ObjectId;
    servicioId: Types.ObjectId;
    fecha: Date;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  }[];
}

export interface IProveedor {
  _id?: Types.ObjectId;
  usuarioId: Types.ObjectId;
  servicios: IService[];
  ubicacion: IUbicacion;
  horarios: IHorario[];
  calendario: ICalendario;
  rating: {
    promedio: number;
    totalOpiniones: number;
  };
  trabajosCompletados: number;
}
