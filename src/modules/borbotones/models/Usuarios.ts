const mongoose = require('mongoose');
const { Schema } = mongoose;

// Subdocumentos
const CiudadSchema = new Schema({
  id_ciudad: { type: Number, required: true },
  nombre: { type: String, required: true },
  codigo_postal: { type: String, required: true },
}, { _id: false });

const EspecialidadSchema = new Schema({
  id_especialidad: { type: Number, required: true },
  nombre: { type: String, required: true },
  fecha_asignacion: { type: Date, required: true },
}, { _id: false });

const ServicioSchema = new Schema({
  id_servicio: { type: Number, required: true },
  nombre: { type: String, required: true },
  precio_personalizado: { type: Number, required: true },
  disponible: { type: Boolean, required: true },
  fecha_asignacion: { type: Date, required: true },
}, { _id: false });

const CalificacionSchema = new Schema({
  id_calificacion: { type: Number, required: true },
  puntuacion: { type: Number, required: true },
  comentario: { type: String, required: true },
  servicio: {
    id_servicio: { type: Number, required: true },
    nombre: { type: String, required: true },
  },
  fecha_calificacion: { type: Date, required: true },
}, { _id: false });

// Schema principal
const UsuarioSchema = new Schema({
  id_usuario: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  activo: { type: Boolean, default: true },
  fecha_registro: { type: Date, required: true },
  ciudad: { type: CiudadSchema, required: true },
  especialidades: { type: [EspecialidadSchema], default: [] },
  servicios: { type: [ServicioSchema], default: [] },
  calificaciones: { type: [CalificacionSchema], default: [] },
});

const Usuario = mongoose.model('usuarios', UsuarioSchema);

module.exports = Usuario;
