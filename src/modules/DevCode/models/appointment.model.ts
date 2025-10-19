import mongoose, { Schema, Document, Types } from 'mongoose';

// Definimos los posibles estados de la cita
export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

// Interfaz que contiene todos los campos de la cita, incluyendo 'ubicacion'
export interface AppointmentDocument extends Document {
 cliente: Types.ObjectId;
 proveedor: Types.ObjectId;
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
 cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
 proveedor: { type: Schema.Types.ObjectId, ref: 'ProveedorInfo', required: true }, 
 
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
 { 
    timestamps: true,
 }
);

export const Appointment = mongoose.model<AppointmentDocument>('Appointment', appointmentSchema);