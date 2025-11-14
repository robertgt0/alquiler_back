import { Schema, model, Document, Types } from "mongoose";

// 1️⃣ Rango horario (intervalo dentro de un día)
export interface IRangoHorario {
  inicio: string; // "08:00"
  fin: string;    // "12:00"
}

// 2️⃣ Día laboral (cada día puede tener varios rangos)
export interface IDiaLaboral {
  dia: number; // 1=Lun ... 7=Dom
  activo: boolean;
  rangos: IRangoHorario[];
}

// 3️⃣ Horario laboral completo
export interface IHorarioLaboral {
  modo: "diaria" | "semanal";
  dias: IDiaLaboral[];
  updatedAt?: Date;
}

// 4️⃣ Disponibilidad general
export interface IDisponibilidad {
  dias: number[]; // 0=Dom, 6=Sáb
  horaInicio: string; // "08:00"
  horaFin: string;    // "17:00"
  duracionTurno: number; // en minutos
}

export interface IFixer extends Document {
  nombre: string;
  usuario: string;
  apellido?: string;
  email: string;
  hash_password: string;
  activo: boolean;
  fecha_registro: Date;
  telefono?: string;
  carnet_identidad?: string;
  metodo_pago?: string;
  descripcion?: string;
  categorias?: Types.ObjectId[];
  especialidades?: Types.ObjectId[];
  servicios?: Types.ObjectId[];
  disponibilidad?: IDisponibilidad;
  horarioLaboral?: IHorarioLaboral;
  ubicacion?: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  rating_promedio?: number;
  reseñas_recibidas?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const rangoHorarioSchema = new Schema<IRangoHorario>(
  {
    inicio: { type: String, required: true },
    fin: { type: String, required: true },
  },
  { _id: false }
);

const diaLaboralSchema = new Schema<IDiaLaboral>(
  {
    dia: { type: Number, required: true },
    activo: { type: Boolean, default: true },
    rangos: [rangoHorarioSchema],
  },
  { _id: false }
);

const horarioLaboralSchema = new Schema<IHorarioLaboral>(
  {
    modo: { type: String, enum: ["diaria", "semanal"], required: true },
    dias: [diaLaboralSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const disponibilidadSchema = new Schema<IDisponibilidad>(
  {
    dias: [{ type: Number, required: true }],
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
    duracionTurno: { type: Number, required: true },
  },
  { _id: false }
);

const fixerSchema = new Schema<IFixer>(
  {
    nombre: { type: String, required: true },
    usuario: { type: String, required: true, unique: true },
    apellido: { type: String },
    email: { type: String, required: true, unique: true },
    hash_password: { type: String, required: true },
    activo: { type: Boolean, default: true },
    fecha_registro: { type: Date, default: Date.now },
    telefono: { type: String },
    carnet_identidad: { type: String },
    metodo_pago: { type: String },
    descripcion: { type: String },

    categorias: [{ type: Schema.Types.ObjectId, ref: "Categoria" }],
    especialidades: [{ type: Schema.Types.ObjectId, ref: "Especialidad" }],
    servicios: [{ type: Schema.Types.ObjectId, ref: "Servicio" }],

    disponibilidad: disponibilidadSchema,
    horarioLaboral: horarioLaboralSchema,

    ubicacion: {
      lat: Number,
      lng: Number,
      direccion: String,
    },

    rating_promedio: { type: Number, default: 0 },
    reseñas_recibidas: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt y updatedAt automáticos
);

export const Fixer = model<IFixer>("Fixer", fixerSchema);