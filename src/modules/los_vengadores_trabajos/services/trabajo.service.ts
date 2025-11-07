// src/modules/los_vengadores_trabajos/services/trabajo.service.ts
import mongoose from 'mongoose';
import TrabajoModel from '../models/trabajo.model';
import ClienteModel from '../models/cliente.model';
import ProveedorModel from '../models/proveedor.model';

// --- NUEVAS FUNCIONES PARA HU 1.7 y 1.8 ---

/**
 * HU 1.7: Obtener la lista de trabajos para un Proveedor
 */
// ✅ ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA!
export const getTrabajosProveedorService = async (
  proveedorId: string,
  estado?: string
) => {
  const filtro: any = {
    id_proveedor: new mongoose.Types.ObjectId(proveedorId),
  };
  if (estado) {
    filtro.estado = estado;
  }
  return await TrabajoModel.find(filtro)
    .populate('id_cliente', 'nombre') 
    .sort({ fecha: -1 });
};

/**
 * HU 1.8: Obtener la lista de trabajos para un Cliente
 */
// ✅ ¡AQUÍ ESTÁ LA OTRA FUNCIÓN QUE FALTABA!
export const getTrabajosClienteService = async (
  clienteId: string,
  estado?: string
) => {
  const filtro: any = {
    id_cliente: new mongoose.Types.ObjectId(clienteId),
  };
  if (estado) {
    filtro.estado = estado;
  }
  return await TrabajoModel.find(filtro)
    .populate('id_proveedor', 'nombre') 
    .sort({ fecha: -1 });
};

// --- TUS FUNCIONES EXISTENTES ---

export const crearTrabajo = async (data: any) => {
  const cliente = await ClienteModel.findById(data.id_cliente);
  const proveedor = await ProveedorModel.findById(data.id_proveedor);

  if (!cliente) throw new Error('El cliente no existe');
  if (!proveedor) throw new Error('El proveedor no existe');

  const existeTrabajo = await TrabajoModel.findOne({
    id_cliente: data.id_cliente,
    id_proveedor: data.id_proveedor,
    fecha: data.fecha,
  });
  if (existeTrabajo)
    throw new Error(
      'Ya existe un trabajo entre este cliente y proveedor en esa fecha'
    );

  const nuevoTrabajo = new TrabajoModel(data);
  return await nuevoTrabajo.save();
};

export const obtenerTrabajos = async () => {
  return await TrabajoModel.find()
    .populate('id_cliente', 'nombre email')
    .populate('id_proveedor', 'nombre email')
    .sort({ createdAt: -1 });
};

export const obtenerTrabajoPorId = async (id: string) => {
  return await TrabajoModel.findById(id)
    .populate('id_cliente', 'nombre email')
    .populate('id_proveedor', 'nombre email');
};

export const eliminarTrabajo = async (id: string) => {
  return await TrabajoModel.findByIdAndDelete(id);
};