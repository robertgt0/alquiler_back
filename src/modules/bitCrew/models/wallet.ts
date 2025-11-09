import mongoose, { Schema, model } from 'mongoose';
import { IBilletera } from '../types/index';

// --- Esquema Billetera ---
const BilleteraSchema = new Schema<IBilletera>({
  fixer_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Fixer',
    required: true, 
    unique: true
  },
  saldo: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  estado: {
    type: String,
    enum: ['activo', 'restringido'], // Solo permite estos valores
    default: 'activo'
  },
  alerta: { 
    type: String, 
    enum: ['saldo_bajo', 'restringido'], 
    default: null 
  },
  fecha_actualizacion: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'wallet' // Apunta a la colección 'wallet'
});

const BilleteraModel = mongoose.models.Billetera || model<IBilletera>('Billetera', BilleteraSchema);

export default BilleteraModel;
