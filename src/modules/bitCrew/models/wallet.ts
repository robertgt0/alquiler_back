
import mongoose, { Schema, model } from 'mongoose';


import { IBilletera } from '../types/wallet.types'; 

// --- Esquema Billetera ---
const BilleteraSchema = new Schema<IBilletera>({
  fixer_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Fixer', // Referencia al modelo 'Fixer' de esta misma carpeta
    required: true, 
    unique: true 
  },
  saldo: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  fecha_actualizacion: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'wallet' 
});

const BilleteraModel = mongoose.models.Billetera || model<IBilletera>('Billetera', BilleteraSchema);

export default BilleteraModel;
