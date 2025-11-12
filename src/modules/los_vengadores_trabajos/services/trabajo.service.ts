// src/modules/los_vengadores_trabajos/services/trabajo.service.ts
import mongoose from 'mongoose';
import TrabajoModel from '../models/trabajo.model';
import ClienteModel from '../models/cliente.model';
import ProveedorModel from '../models/proveedor.model';

/* -------------------------------------------------------------------------- */
/* 🔹 NUEVAS FUNCIONES PARA HU 1 (Aceptar / Rechazar trabajo)                */
/* -------------------------------------------------------------------------- */

/**
 * Cambia el estado de un trabajo a "confirmado".
 */
export const confirmarTrabajoService = async (id: string) => {
  const trabajo = await TrabajoModel.findById(id);
  if (!trabajo) throw new Error('Trabajo no encontrado');

  // Solo puede confirmar si está pendiente
  if (trabajo.estado !== 'pendiente') {
    throw new Error('Solo se pueden confirmar trabajos pendientes');
  }

  trabajo.estado = 'confirmado';
  await trabajo.save();

  return {
    success: true,
    message: 'Trabajo confirmado correctamente',
    data: trabajo,
  };
};

/**
 * Cambia el estado de un trabajo a "cancelado".
 */
export const rechazarTrabajoService = async (id: string) => {
  const trabajo = await TrabajoModel.findById(id);
  if (!trabajo) throw new Error('Trabajo no encontrado');

  // Solo puede rechazar si está pendiente
  if (trabajo.estado !== 'pendiente') {
    throw new Error('Solo se pueden rechazar trabajos pendientes');
  }

  trabajo.estado = 'cancelado';
  await trabajo.save();

  return {
    success: true,
    message: 'Trabajo rechazado correctamente',
    data: trabajo,
  };
};

/* -------------------------------------------------------------------------- */
/* 🔹 FUNCIONES HU 1.7 (Proveedor) Y HU 1.8 (Cliente)                        */
/* -------------------------------------------------------------------------- */

export const getTrabajosProveedorService = async (
  proveedorId: string,
  estado?: string
) => {
  const filtro: any = {
    id_proveedor: new mongoose.Types.ObjectId(proveedorId),
  };
  if (estado) filtro.estado = estado;

  return await TrabajoModel.find(filtro)
    .populate('id_cliente', 'nombre')
    .sort({ fecha: -1 });
};

export const getTrabajosClienteService = async (
  clienteId: string,
  estado?: string
) => {
  const filtro: any = {
    id_cliente: new mongoose.Types.ObjectId(clienteId),
  };
  if (estado) filtro.estado = estado;

  return await TrabajoModel.find(filtro)
    .populate('id_proveedor', 'nombre')
    .sort({ fecha: -1 });
};

/* -------------------------------------------------------------------------- */
/* 🔹 FUNCIONES EXISTENTES                                                   */
/* -------------------------------------------------------------------------- */

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
