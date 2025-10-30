import { Schema, model, Document } from 'mongoose';

export interface IServicio {
  _id?: string;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  precio: number;
  rating?: number;
}
export interface IHorarioDia {
    numeroDia: number; // 0=Dom, 1=Lun, ..., 6=Sab
    inicio: string;    // "09:00"
    fin: string;       // "12:30"
}

// 2. Nueva Interfaz de Disponibilidad (más simple)
export interface IDisponibilidad {
    dias: IHorarioDia[]; 
    horaInicio: string; // "08:00" (Horario más temprano)
    horaFin: string;    // "18:00" (Horario más tarde)
    duracionTurno: number; // minutos
}
export interface IRangoHorario {
 inicio: string; // Es un string de hora, ej. "09:00"
 fin: string;    // Es un string de hora, ej. "12:30"
}

export interface IProveedor extends Document {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password: string; // se guarda hasheada
  servicios: IServicio[];
  horarioLaboral?: IHorarioLaboral;
  disponibilidad: IDisponibilidad;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RangoHorario {
  inicio: string;  // formato "HH:mm"
  fin: string;     // formato "HH:mm"
}

export interface IDiaLaboral {
  dia: number;     // [1,2,3,4,5,6,7] -> Lun a Dom
  activo: boolean;
  rangos: RangoHorario[];
}

export interface IHorarioLaboral {
  modo: 'diaria' | 'semanal';
  dias: IDiaLaboral[];
  updatedAt?: Date;
}

const RangoHorarioSchema = new Schema<RangoHorario>({
  inicio: { type: String, required: true },
  fin: { type: String, required: true }
}, { _id: false });

const DiaLaboralSchema = new Schema<IDiaLaboral>({
  dia: { type: Number, required: true },
  activo: { type: Boolean, default: false },
  rangos: [RangoHorarioSchema]
}, { _id: false });

const HorarioLaboralSchema = new Schema<IHorarioLaboral>({
  modo: { 
    type: String, 
    enum: ['diaria', 'semanal'], 
    required: true 
  },
  dias: [DiaLaboralSchema],
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });


const ServicioSchema = new Schema<IServicio>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  duracion: { type: Number, required: true },
  precio: { type: Number, required: true },
  rating: { type: Number, default: 0 },
});
const HorarioDiaSchema = new Schema({
    numeroDia: { type: Number, required: true, min: 0, max: 6 },
    inicio: { type: String, required: true },
    fin: { type: String, required: true },
});
const DisponibilidadSchema = new Schema<IDisponibilidad>({
    dias: {
        type: [HorarioDiaSchema], // Array de subdocumentos
        required: true,
    },
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
    duracionTurno: { type: Number, required: true },
});
const ProveedorSchema = new Schema<IProveedor>(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    password: { type: String, required: true },
    servicios: [ServicioSchema],
    horarioLaboral: { type: HorarioLaboralSchema },
    disponibilidad: { type: DisponibilidadSchema, required: true },
    ubicacion: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export const Proveedor = model<IProveedor>('Proveedor', ProveedorSchema);
