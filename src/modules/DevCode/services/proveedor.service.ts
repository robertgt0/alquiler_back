import { Proveedor, IProveedor,IRangoHorario,IDisponibilidad, IHorarioLaboral} from '@models/proveedor.model';
import { Cita } from '@models/cita.model';
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

    const { dias, duracionTurno } = proveedor.disponibilidad; 
    const citas = await Cita.find({
        proveedorId,
        fecha: { $gte: fechaInicio, $lte: fechaFin }
    });

    const disponibilidad: Record<string, string[]> = {};

    let current = dayjs(fechaInicio);
    const end = dayjs(fechaFin);

    while (current.isBefore(end) || current.isSame(end)) {
        const diaSemana = current.day(); // Número del día (0-6)
        const fechaStr = current.format('YYYY-MM-DD');
        disponibilidad[fechaStr] = [];

        const rangosDelDia = dias.filter(r => r.numeroDia === diaSemana);

        if (rangosDelDia.length > 0) {
            const horarios: string[] = [];

            for (const rango of rangosDelDia) {
                let hora = dayjs(`${fechaStr} ${rango.inicio}`, 'YYYY-MM-DD HH:mm');
                const limite = dayjs(`${fechaStr} ${rango.fin}`, 'YYYY-MM-DD HH:mm');

                while (hora.isBefore(limite)) {
                    horarios.push(hora.format('HH:mm'));
                    hora = hora.add(duracionTurno, 'minute');
                }
            }

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
  
  // ProveedorService.ts

  static async guardarHorario(idProveedor: string, disponibilidad: IDisponibilidad) {
      const proveedor = await Proveedor.findById(idProveedor);
      if (!proveedor) throw new Error('Proveedor no encontrado');
      proveedor.disponibilidad = disponibilidad;

      await proveedor.save();
      return proveedor;
  }


 
  static async obtenerHorario(idProveedor: string) {
    const proveedor = await Proveedor.findById(idProveedor).select('disponibilidad');
    if (!proveedor) throw new Error('Proveedor no encontrado');
    return proveedor.disponibilidad;
  }

  static async guardarHorarioLaboral(proveedorId: string, horario: IHorarioLaboral) {
    const actualizado = await Proveedor.findByIdAndUpdate(
      proveedorId,
      { 
        horarioLaboral: {
          ...horario,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!actualizado) {
      throw new Error('Proveedor no encontrado');
    }

    return actualizado;
  }
}
