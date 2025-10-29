import { Proveedor, IProveedor } from '../../../models/proveedor.model';
import { Cita } from '../../../models/cita.model';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export class ProveedorService {
  // Crear proveedor
  static async crearProveedor(data: Partial<IProveedor>) {
    const nuevo = new Proveedor(data);
    await nuevo.save();
    return nuevo;
  }

  // Obtener todos los proveedores
  static async listarProveedores() {
    return Proveedor.find();
  }

  // Obtener proveedor por ID
  static async obtenerProveedor(id: string) {
    return Proveedor.findById(id);
  }

  static async obtenerDisponibilidad(proveedorId: string, fechaInicio: string, fechaFin: string) {
    const proveedor = await Proveedor.findById(proveedorId);
    if (!proveedor) throw new Error('Proveedor no encontrado');

    const { dias, horaInicio, horaFin, duracionTurno } = proveedor.disponibilidad;

    // Traemos todas las citas del rango
    const citas = await Cita.find({
      proveedorId,
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    });

    const disponibilidad: Record<string, string[]> = {};

    let current = dayjs(fechaInicio);
    const end = dayjs(fechaFin);

    while (current.isBefore(end) || current.isSame(end)) {
      const diaSemana = current.day();
      const fechaStr = current.format('YYYY-MM-DD');
      disponibilidad[fechaStr] = [];

      if (dias.includes(diaSemana)) {
        const horarios: string[] = [];
        let hora = dayjs(`${fechaStr} ${horaInicio}`, 'YYYY-MM-DD HH:mm');
        const limite = dayjs(`${fechaStr} ${horaFin}`, 'YYYY-MM-DD HH:mm');

        while (hora.isBefore(limite)) {
          horarios.push(hora.format('HH:mm'));
          hora = hora.add(duracionTurno, 'minute');
        }

        // Filtrar horarios ocupados
        const citasDelDia = citas.filter(c => c.fecha === fechaStr);
        disponibilidad[fechaStr] = horarios.filter(h => {
          return !citasDelDia.some(cita => {
            const citaInicio = dayjs(`${cita.fecha} ${cita.horario.inicio}`, 'YYYY-MM-DD HH:mm');
            const citaFin = dayjs(`${cita.fecha} ${cita.horario.fin}`, 'YYYY-MM-DD HH:mm');
            const slotStart = dayjs(`${fechaStr} ${h}`, 'YYYY-MM-DD HH:mm');
            const slotEnd = slotStart.add(duracionTurno, 'minute');

            // Retornamos false si hay solapamiento
            return slotStart.isBefore(citaFin) && slotEnd.isAfter(citaInicio);
          });
        });
      }

      current = current.add(1, 'day');
    }

    return disponibilidad;
  }

}
