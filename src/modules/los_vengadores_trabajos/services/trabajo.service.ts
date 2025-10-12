// src/modules/los_vengadores_trabajos/services/trabajo.service.ts
import { ITrabajo, TrabajoStatus } from '../models/trabajo.model';

// Nuestra "base de datos" falsa con datos de ejemplo para las HUs
const mockTrabajos: ITrabajo[] = [
  { proveedor: { nombre: 'Daniel Paredez', id: 'proveedor1' }, cliente: { nombre: 'Juan Perez', id: 'cliente1' }, fecha: '25/9/25', horaInicio: '08:00', horaFin: '10:00', servicio: 'Electricista', estado: 'Confirmado' },
  { proveedor: { nombre: 'Daniel Paredez', id: 'proveedor1' }, cliente: { nombre: 'Carlos Mendez', id: 'cliente2' }, fecha: '27/9/25', horaInicio: '15:00', horaFin: '17:00', servicio: 'Jardineria', estado: 'Pendiente' },
  { proveedor: { nombre: 'Lucia Ramirez', id: 'proveedor2' }, cliente: { nombre: 'Juan Perez', id: 'cliente1' }, fecha: '28/9/25', horaInicio: '11:00', horaFin: '13:00', servicio: 'Plomeria', estado: 'Cancelado' },
  { proveedor: { nombre: 'Daniel Paredez', id: 'proveedor1' }, cliente: { nombre: 'Elena Vargas', id: 'cliente3' }, fecha: '27/9/25', horaInicio: '15:00', horaFin: '17:00', servicio: 'Electricista', estado: 'Pendiente' },
  { proveedor: { nombre: 'Sergio Romero', id: 'proveedor3' }, cliente: { nombre: 'Juan Perez', id: 'cliente1' }, fecha: '30/9/25', horaInicio: '09:00', horaFin: '11:00', servicio: 'Cerrajería', estado: 'Terminado' }
];

// Lógica para obtener trabajos de un PROVEEDOR específico (HU 1.7)
export const getTrabajosProveedorService = async (proveedorId: string, estado?: TrabajoStatus): Promise<ITrabajo[]> => {
  let trabajos = mockTrabajos.filter(t => t.proveedor.id === proveedorId);
  if (estado) {
    trabajos = trabajos.filter(t => t.estado === estado);
  }
  return trabajos;
};

// Lógica para obtener trabajos de un CLIENTE específico (HU 1.8)
export const getTrabajosClienteService = async (clienteId: string, estado?: TrabajoStatus): Promise<ITrabajo[]> => {
  let trabajos = mockTrabajos.filter(t => t.cliente.id === clienteId);
  if (estado) {
    trabajos = trabajos.filter(t => t.estado === estado);
  }
  return trabajos;
};