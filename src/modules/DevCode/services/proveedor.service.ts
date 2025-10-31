import { Proveedor, IProveedor, IHorarioLaboral, RangoHorario } from '@models/proveedor.model';
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

    const horarioBase = proveedor.horarioLaboral;
    const duracionTurno = proveedor.disponibilidad.duracionTurno;

    // Si no hay horario laboral configurado, la disponibilidad es 0
        if (!horarioBase || horarioBase.dias.length === 0) {
             return {}; 
        }
        
    // Traemos todas las citas del rango
    const citas = await Cita.find({
      proveedorId,
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    });

    const disponibilidad: Record<string, string[]> = {};

    let current = dayjs(fechaInicio);
    const end = dayjs(fechaFin);

    while (current.isBefore(end) || current.isSame(end)) {
      const diaSemanaDayjs = current.day(); // 0 a 6
      const diaSemanaModel = (diaSemanaDayjs === 0) ? 7 : diaSemanaDayjs;
      const fechaStr = current.format('YYYY-MM-DD');
      disponibilidad[fechaStr] = [];

    // 1. Encontrar el objeto IDiaLaboral para el día actual
     const diaLaboral = horarioBase.dias.find(d => d.dia === diaSemanaModel);

    // 2. FILTRAR DÍAS NO LABORALES (activo: true)
     if (diaLaboral && diaLaboral.activo && diaLaboral.rangos.length > 0) {
         let horarios: string[] = [];

         // 3. GENERAR SLOTS BASE ITERANDO SOBRE MÚLTIPLES RANGOS
         for (const rango of diaLaboral.rangos) {
               let hora = dayjs(`${fechaStr} ${rango.inicio}`, 'YYYY-MM-DD HH:mm');
               const limite = dayjs(`${fechaStr} ${rango.fin}`, 'YYYY-MM-DD HH:mm');

              while (hora.isBefore(limite)) {
                 horarios.push(hora.format('HH:mm'));
                 hora = hora.add(duracionTurno, 'minute');
              }
          }

         // 4. FILTRAR SLOTS OCUPADOS
         const citasDelDia = citas.filter(c => c.fecha === fechaStr);
                
         disponibilidad[fechaStr] = horarios.filter(h => {
           return !citasDelDia.some(cita => {
               const citaInicio = dayjs(`${cita.fecha} ${cita.horario.inicio}`, 'YYYY-MM-DD HH:mm');
               const citaFin = dayjs(`${cita.fecha} ${cita.horario.fin}`, 'YYYY-MM-DD HH:mm');
               const slotStart = dayjs(`${fechaStr} ${h}`, 'YYYY-MM-DD HH:mm');
               const slotEnd = slotStart.add(duracionTurno, 'minute');

               return slotStart.isBefore(citaFin) && slotEnd.isAfter(citaInicio);
            });
         });
    }

            current = current.add(1, 'day');
        }

        return disponibilidad;
    }


  private static checkRangosSolapados(rangos: RangoHorario[]): boolean {
        // Mapear los rangos a objetos Day.js y ordenarlos por hora de inicio
        const intervalos = rangos.map(rango => ({
            start: dayjs(rango.inicio, 'HH:mm'),
            end: dayjs(rango.fin, 'HH:mm')
        })).sort((a, b) => a.start.valueOf() - b.start.valueOf());

        for (let i = 0; i < intervalos.length - 1; i++) {
            const actual = intervalos[i];
            const siguiente = intervalos[i + 1];
            
            if (actual.end.isAfter(siguiente.start)) {
                return true; 
            }
        }
        return false; 
    }
    
    
  static async guardarHorarioLaboral(proveedorId: string, horario: IHorarioLaboral) {
  // VALIDACIÓN CRÍTICA: Solapamiento de Rangos
  for (const dia of horario.dias) {
   if (dia.activo && dia.rangos.length > 1) {
       // Llama a la función de verificación
       const haySolapamiento = ProveedorService.checkRangosSolapados(dia.rangos);
            
       if (haySolapamiento) {
           throw new Error(`Los rangos de tiempo para el día ${dia.dia} se solapan.`);
        }
    }

  }


  const actualizado = await Proveedor.findByIdAndUpdate(
    proveedorId,
    { 
      horarioLaboral: {
         ...horario,
          updatedAt: new Date()
        }
    },
    { new: true, runValidators: true } 
    );

    if (!actualizado) {
        throw new Error('Proveedor no encontrado');
    }

    return actualizado;
}
}
