import mongoose, { Schema, model } from 'mongoose';
import { IBilletera } from '../types/wallet.types'; 

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
  fecha_actualizacion: { 
    type: Date, 
    default: Date.now 
  }

}, {
  collection: 'wallet' // Apunta a la colección 'wallet'
});

const BilleteraModel = mongoose.models.Billetera || model<IBilletera>('Billetera', BilleteraSchema);

export default BilleteraModel;