import { Schema, model, Document } from 'mongoose';

// 1. Interfaz para el tipado (TypeScript)
export interface IAppointment extends Document {
    fechaCita: Date;
    idProveedor: Schema.Types.ObjectId; 
    idServicio: Schema.Types.ObjectId;   
    estado: string; // Ej: 'Reservada', 'Cancelada', 'Completada'
    horaInicio: Date; 
    horaFin: Date;     
}

// 2. Definición del Schema (Mongoose)
const appointmentSchema = new Schema<IAppointment>({
    fechaCita: {
        type: Date,
        required: true
    },
    idProveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor', 
        required: true
    },
    idServicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio', 
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Pendiente', 'Reservada', 'Cancelada', 'Completada'],
        default: 'Pendiente'
    }
}, { timestamps: true }); 

// 3. Creación y Exportación del Modelo
const AppointmentModel = model<IAppointment>('Cita', appointmentSchema);

export default AppointmentModel;