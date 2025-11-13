import { Document, Types } from 'mongoose'; 

//  ENTIDADES PRINCIPALES

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
  alerta?: 'saldo_bajo' | 'restringido' | null; // 🚨 Nueva propiedad añadida
  fecha_actualizacion: Date;
}

// Interfaz para 'Transacciones'
export interface ITransaccion extends Document {
  _id: Types.ObjectId;
  fixer_id: Types.ObjectId;
  billetera_id: Types.ObjectId;
  tipo: 'credito' | 'debito'; 
  monto: number;
  descripcion: string;
  fecha: Date;
  saldo_resultante: number;
}

export interface IRecarga {
  nombre: string;
  detalle: string;
  monto: number;
  correo: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fecha?: Date;
}

export interface EjemploEntity {
  _id?: string;
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface OtraInterface {
  
}
