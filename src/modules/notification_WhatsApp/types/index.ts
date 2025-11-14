import { Document, Types } from 'mongoose'; 

// Interfaz para 'Fixer'
export interface IFixer extends Document {
  _id: Types.ObjectId; 
  nombre: string;
  usuario: string;
  email: string;
  hash_password: string;
  activo: boolean;
  fecha_registro: Date;
  telefono?: string;
}

// Interfaz para 'Trabajo'
export interface ITrabajo extends Document {
  fixer_id: Types.ObjectId; 
  descripcion: string;
  estado: string;
  monto_a_pagar: number;
  fecha_creacion: Date;
  fecha_pago?: Date;
}

// Interfaz para 'Billetera'
export interface IBilletera extends Document {
  _id: Types.ObjectId;
  fixer_id: Types.ObjectId;
  saldo: number;
  estado: string; 
  fecha_actualizacion: Date;
}

export interface ITransaccion extends Document {
  _id: Types.ObjectId;
  fixer_id: Types.ObjectId;
  billetera_id: Types.ObjectId;
  tipo: 'credito' | 'debito'; // Tu imagen muestra 'credito', asumo que 'debito' también existe
  monto: number;
  descripcion: string;
  fecha: Date;
  saldo_resultante: number;
}