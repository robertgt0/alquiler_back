import mongoose, { Schema, model } from 'mongoose';
import { ITransaccion } from '../types';

// Basado en tu imagen de la base de datos
const TransaccionSchema = new Schema<ITransaccion>({
  fixer_id: { type: Schema.Types.ObjectId, ref: 'Fixer', required: true },
  billetera_id: { type: Schema.Types.ObjectId, ref: 'Billetera', required: true }, // Asumo que refieres a 'Billetera'
  tipo: { type: String, enum: ['credito', 'debito'], required: true },
  monto: { type: Number, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  saldo_resultante: { type: Number, required: true }
}, {
  collection: 'transacciones' // Nombre de tu colección en la DB
});

const TransaccionModel = mongoose.models.Transaccion || model<ITransaccion>('Transaccion', TransaccionSchema);

export default TransaccionModel;