import { Schema, model } from "mongoose";

const servicioSchema = new Schema({
  id_servicio: { type: Number, required: true },
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
});

const calificacionSchema = new Schema({
  estrellas: { type: Number, required: true, min: 1, max: 5 },
  comentario: String,
  fecha: { type: Date, default: Date.now },
  usuario_id: { type: Schema.Types.ObjectId, ref: "Usuario" },
});

const usuarioSchema = new Schema({
  id_usuario: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: String,
  activo: { type: Boolean, default: true },
  fecha_registro: { type: Date, default: Date.now },
  
  // Campos de perfil profesional
  area_principal: { type: String, required: true },
  especialidades: [{
    id_especialidad: Number,
    nombre: String,
    descripcion: String,
  }],
  
  // Servicios y precios
  servicios: [servicioSchema],
  
  // Ubicación
  ciudad: {
    id_ciudad: Number,
    nombre: String,
    zona: String,
    direccion_detallada: String,
  },
  
  // Disponibilidad
  disponibilidad: {
    estado: { type: String, enum: ["Disponible", "No Disponible", "Ocupado"], default: "Disponible" },
    horario: {
      lunes_viernes: String,
      sabados: String,
      domingos: String,
    }
  },
  
  // Calificaciones y reseñas
  calificaciones: [calificacionSchema],
  calificacion_promedio: { type: Number, default: 0 },
  
  // Medios de contacto
  medios_contacto: {
    whatsapp: Boolean,
    videoconsulta: Boolean,
    presencial: Boolean,
  },
  
  // Certificaciones y credenciales
  certificaciones: [{
    nombre: String,
    institucion: String,
    fecha: Date,
  }],
  
  // Metadata
  ultima_actualizacion: { type: Date, default: Date.now },
});

// Middleware para calcular el promedio de calificaciones antes de guardar
usuarioSchema.pre("save", function(next) {
  if (this.calificaciones && this.calificaciones.length > 0) {
    const total = this.calificaciones.reduce((sum: number, cal: any) => sum + cal.estrellas, 0);
    this.calificacion_promedio = Number((total / this.calificaciones.length).toFixed(1));
  }
  next();
});

export const Usuario = model("Usuario", usuarioSchema);