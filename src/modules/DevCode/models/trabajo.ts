import mongoose, { Schema, model } from 'mongoose';
import { ITrabajo } from '../types/index'; // Importa la nueva interfaz

// Esquema para 'trabajo'
const TrabajoSchema = new Schema<ITrabajo>({
  fixer_id: { type: Schema.Types.ObjectId, ref: 'Fixer', required: true },
  descripcion: { type: String, required: true },
  estado: { type: String, required: true, enum: ['pendiente', 'completado', 'pagado'] },
  monto_a_pagar: { type: Number, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_pago: { type: Date, required: false }
}, {
  collection: 'trabajo' // Apunta a tu colección 'trabajo'
});

// Modelo 'trabajo'
const TrabajoModel = mongoose.models.Trabajo || model<ITrabajo>('Trabajo', TrabajoSchema);

export default TrabajoModel;