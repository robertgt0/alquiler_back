import mongoose, { Schema, Document, Types } from 'mongoose';

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface AppointmentDocument extends Document {
  cliente: Types.ObjectId;
  proveedor: Types.ObjectId;
  fecha: Date;
  horaInicio: Date;
  horaFin: Date;
  duracionMinutos: number;
  ubicacion: string;
  notas?: string;
  estado: AppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    cliente: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    fecha: { type: Date, required: true },
    horaInicio: { type: Date, required: true },
    horaFin: { type: Date, required: true },
    duracionMinutos: { type: Number, required: true, min: 1 },
    ubicacion: { type: String, required: true, trim: true },
    notas: { type: String, trim: true },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
);

export default mongoose.model<AppointmentDocument>('Appointment', appointmentSchema);
