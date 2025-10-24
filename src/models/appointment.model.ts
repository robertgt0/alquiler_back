import { Schema, model, Document } from 'mongoose';

// 1. Interfaz para el tipado (TypeScript)
export interface IAppointment extends Document {
    fechaCita: Date;
    idProveedor: Schema.Types.ObjectId; // Referencia a la tabla Proveedors
    idServicio: Schema.Types.ObjectId;   // Referencia a la tabla Servicios
    estado: string; // Ej: 'Reservada', 'Cancelada', 'Completada'
    // ... otros campos que hayas definido
}

// 2. Definición del Schema (Mongoose)
const appointmentSchema = new Schema<IAppointment>({
    fechaCita: {
        type: Date,
        required: true
    },
    idProveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor', // Nombre del modelo de proveedor
        required: true
    },
    idServicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio', // Nombre del modelo de servicio
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Pendiente', 'Reservada', 'Cancelada', 'Completada'],
        default: 'Pendiente'
    }
}, { timestamps: true }); // Opcional: añade createdAt y updatedAt

// 3. Creación y Exportación del Modelo
const AppointmentModel = model<IAppointment>('Cita', appointmentSchema);

export default AppointmentModel;