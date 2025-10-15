// src/modules/los_vengadores_trabajos/models/calendario-disponibilidad.model.ts
import { Schema, model } from 'mongoose';

const disponibilidadSchema = new Schema({
    proveedorId: { type: String, required: true },  // ID o nombre del proveedor
    fecha: { type: String, required: true },        // Formato YYYY-MM-DD
    horaInicio: { type: String, required: true },   // Ej. "08:00"
    horaFin: { type: String, required: true },      // Ej. "12:00"
    costoHora: { type: Number, required: true }     // Ej. 25
});

export const DisponibilidadModel = model('Disponibilidad', disponibilidadSchema);
