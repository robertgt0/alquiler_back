// src/modules/los_vengadores_trabajos/services/trabajo.service.ts
import { ITrabajoCompleto, ITrabajoSolicitado } from '../models/trabajo.model';

// --- NUESTRAS BASES DE DATOS FALSAS QUE SIMULAN LAS COLECCIONES hasta que hagan la bd oficial ---

// 1. coleccion de Proveedores (datos simulados)
const mockProveedores = [
  { _id: "proveedor_123", nombre: "Juan Perez", profesion: "Electricista" },
  { _id: "proveedor_456", nombre: "Maria Rojas", profesion: "Plomeria" },
  { _id: "proveedor_789", nombre: "Sergio Romero", profesion: "Cerrajería" },
];

// 2. coleccion de Clientes (datos simulados)
const mockClientes = [
  { _id: "cliente_abc", nombre: "Ana Garcia" },
  { _id: "cliente_def", nombre: "Carlos Mendez" },
  { _id: "cliente_ghi", nombre: "Elena Vargas" },
];

// 3. coleccion de Trabajos Solicitados (datos simulados)
const mockTrabajosSolicitados: ITrabajoSolicitado[] = [
  { _id: "trabajo_xyz", id_proveedor: "proveedor_123", id_cliente: "cliente_abc", fecha: "25/9/25", horaInicio: "08:00", horaFin: "10:00", estado: "Confirmado" },
  { _id: "trabajo_uvw", id_proveedor: "proveedor_123", id_cliente: "cliente_def", fecha: "27/9/25", horaInicio: "15:00", horaFin: "17:00", estado: "Pendiente" },
  { _id: "trabajo_rst", id_proveedor: "proveedor_456", id_cliente: "cliente_abc", fecha: "28/9/25", horaInicio: "11:00", horaFin: "13:00", estado: "Cancelado" },
  { _id: "trabajo_pqr", id_proveedor: "proveedor_123", id_cliente: "cliente_ghi", fecha: "27/9/25", horaInicio: "15:00", horaFin: "17:00", estado: "Pendiente" },
  { _id: "trabajo_lmn", id_proveedor: "proveedor_789", id_cliente: "cliente_abc", fecha: "30/9/25", horaInicio: "09:00", horaFin: "11:00", estado: "Terminado" },
];

// --- SERVICIOS ACTUALIZADOS CON LOGICA DE UNION ---

// Lógica para obtener trabajos de un PROVEEDOR
export const getTrabajosProveedorService = async (proveedorId: string, estado?: string): Promise<ITrabajoCompleto[]> => {
  // 1. Filtramos los trabajos por el ID del proveedor y opcionalmente por estado
  let trabajosFiltrados = mockTrabajosSolicitados.filter(t => t.id_proveedor === proveedorId);
  if (estado) {
    trabajosFiltrados = trabajosFiltrados.filter(t => t.estado === estado);
  }

  // 2. unimos los datos: para cada trabajo, buscamos la info del cliente y proveedor
  const trabajosCompletos = trabajosFiltrados.map(trabajo => {
    const proveedorInfo = mockProveedores.find(p => p._id === trabajo.id_proveedor)!;
    const clienteInfo = mockClientes.find(c => c._id === trabajo.id_cliente)!;

    return {
      _id: trabajo._id,
      proveedor: { id: proveedorInfo._id, nombre: proveedorInfo.nombre },
      cliente: { id: clienteInfo._id, nombre: clienteInfo.nombre },
      fecha: trabajo.fecha,
      horaInicio: trabajo.horaInicio,
      horaFin: trabajo.horaFin,
      servicio: proveedorInfo.profesion, // usamos la profesion como el servicio
      estado: trabajo.estado
    };
  });

  return trabajosCompletos;
};

// logica para obtener trabajos de un CLIENTE
export const getTrabajosClienteService = async (clienteId: string, estado?: string): Promise<ITrabajoCompleto[]> => {
  // 1. filtramos los trabajos por el ID del cliente y opcionalmente por estado
  let trabajosFiltrados = mockTrabajosSolicitados.filter(t => t.id_cliente === clienteId);
  if (estado) {
    trabajosFiltrados = trabajosFiltrados.filter(t => t.estado === estado);
  }

  // 2. unimos los datos
  const trabajosCompletos = trabajosFiltrados.map(trabajo => {
    const proveedorInfo = mockProveedores.find(p => p._id === trabajo.id_proveedor)!;
    const clienteInfo = mockClientes.find(c => c._id === trabajo.id_cliente)!;

    return {
      _id: trabajo._id,
      proveedor: { id: proveedorInfo._id, nombre: proveedorInfo.nombre },
      cliente: { id: clienteInfo._id, nombre: clienteInfo.nombre },
      fecha: trabajo.fecha,
      horaInicio: trabajo.horaInicio,
      horaFin: trabajo.horaFin,
      servicio: proveedorInfo.profesion,
      estado: trabajo.estado
    };
  });

  return trabajosCompletos;
};