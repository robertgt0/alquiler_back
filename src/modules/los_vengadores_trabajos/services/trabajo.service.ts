import mongoose from 'mongoose';
import TrabajoModel from '../models/trabajo.model';
import ClienteModel from '../models/cliente.model';
import ProveedorModel from '../models/proveedor.model';

/* -------------------------------------------------------------------------- */
/* 🔹 NUEVAS FUNCIONES PARA HU 1 (Confirmar / Rechazar trabajo)              */
/* -------------------------------------------------------------------------- */

/**
 * Cambia el estado de un trabajo a "Confirmado".
 */
export const confirmarTrabajoService = async (id: string) => {
  const trabajo = await TrabajoModel.findById(id);
  if (!trabajo) throw new Error('Trabajo no encontrado');

  console.log("🔍 Estado actual del trabajo (confirmar):", trabajo.estado);

  // Normalizamos el estado a minúsculas para comparar
  const estado = (trabajo.estado || '').toLowerCase();

  // ✅ Solo si está "pendiente" (cualquier combinación de mayúsculas)
  if (estado !== 'pendiente') {
    throw new Error('Solo se pueden confirmar trabajos pendientes');
  }

  // ✅ Corregimos el valor exacto según el enum del modelo
  trabajo.estado = 'Confirmado';

  // ✅ Evita error de validación si numero_estrellas está en 0
  if (trabajo.numero_estrellas !== undefined && trabajo.numero_estrellas < 1) {
    trabajo.numero_estrellas = 1;
  }

  await trabajo.save();

  return {
    success: true,
    message: 'Trabajo confirmado correctamente',
    data: trabajo,
  };
};

/**
 * Cambia el estado de un trabajo a "Cancelado".
 */
export const rechazarTrabajoService = async (id: string) => {
  const trabajo = await TrabajoModel.findById(id);
  if (!trabajo) throw new Error('Trabajo no encontrado');

  console.log("🔍 Estado actual del trabajo (rechazar):", trabajo.estado);

  const estado = (trabajo.estado || '').toLowerCase();

  if (estado !== 'pendiente') {
    throw new Error('Solo se pueden rechazar trabajos pendientes');
  }

  trabajo.estado = 'Cancelado';

  if (trabajo.numero_estrellas !== undefined && trabajo.numero_estrellas < 1) {
    trabajo.numero_estrellas = 1;
  }

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
  const filtro: Record<string, unknown> = {
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
  const filtro: Record<string, unknown> = {
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

export const crearTrabajo = async (data: Record<string, unknown>) => {
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

  // Evita validación por defecto
  if (!nuevoTrabajo.numero_estrellas || nuevoTrabajo.numero_estrellas < 1) {
    nuevoTrabajo.numero_estrellas = 1;
  }

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

/* -------------------------------------------------------------------------- */
/* 🔹 NUEVAS FUNCIONES HU 1.7 -Sprint 2 (Detalles y Cancelar con Justificación)         */
/* -------------------------------------------------------------------------- */

/**
 * Obtener detalles completos de un trabajo por ID.
 * Popula los datos del cliente y del proveedor para mostrar nombres.
 */
export const obtenerDetallesTrabajoService = async (id: string) => {
  const trabajo = await TrabajoModel.findById(id)
    .populate('id_cliente', 'nombre email')
    .populate('id_proveedor', 'nombre');
    
  if (!trabajo) throw new Error('Trabajo no encontrado');
  
  return trabajo;
};

/**
 * Cancelar un trabajo por parte del proveedor, guardando la justificación.
 */
export const cancelarTrabajoProveedorService = async (id: string, justificacion: string) => {
  const trabajo = await TrabajoModel.findById(id);
  if (!trabajo) throw new Error('Trabajo no encontrado');

  // Actualizamos el estado y guardamos la justificación
  trabajo.estado = 'Cancelado'; // Asegúrate de usar la mayúscula/minúscula que prefieras en tu BD
  trabajo.justificacion_cancelacion = justificacion;
  trabajo.cancelado_por = 'Proveedor';

  // ✅ Corrección de validación de estrellas (igual que en tus otras funciones)
  if (trabajo.numero_estrellas !== undefined && trabajo.numero_estrellas < 1) {
    trabajo.numero_estrellas = 1;
  }

  return await trabajo.save();
};