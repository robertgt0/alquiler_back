// src/modules/los_vengadores_trabajos/models/calendario-disponibilidad.model.ts
import { Schema, model } from 'mongoose';

const horarioSchema = new Schema({
    horaInicio: {type: String, required: true},
    horaFin: {type: String, required: true},
    costoHora: {type: Number, required: true},
    disponible: {type: Boolean, required: true, default: true}
});

const disponibilidadSchema = new Schema({
    proveedorId: { type: String, required: true },
    fecha: { type: String, required: true },
    horarios: [horarioSchema]
});

export const DisponibilidadModel = model('Disponibilidad', disponibilidadSchema);
