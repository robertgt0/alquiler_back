import { isValidObjectId, Types } from 'mongoose';
import ProviderModel from '../../../models/provider.model';
import AppointmentModel from '../models/Appointments'; 

export interface AvailabilityResponse {
  providerId: string;
  date: string;
  slots: string[];
}

const DEFAULT_DURATION_MINUTES = 30; 

export const getAvailabilityService = async (
  providerId: string,
  dateString: string
): Promise<AvailabilityResponse> => {
    
    // 1. VALIDACIÓN Y PREPARACIÓN DE ENTRADA
    if (!isValidObjectId(providerId)) {
      throw new Error('ID de proveedor inválido.');
    }
    
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      throw new Error('Fecha inválida. Use el formato YYYY-MM-DD.');
    }

    const isoDateString = targetDate.toISOString().slice(0, 10); 

    // 2. CONSULTAR HORARIO LABORAL (Modelo Provider)
 
    const objectId = new Types.ObjectId(providerId); 
    const provider = await ProviderModel.findById(objectId, 'horarios').lean().exec(); 
    
    if (!provider) {
      throw new Error('Proveedor no encontrado.');
    }
    
    if (!provider.horarios || provider.horarios.length === 0) {
      return { providerId, date: isoDateString, slots: [] }; 
    }
    
    // 3. CONSULTAR CITAS OCUPADAS (Modelo Appointment)

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const reservedAppointments = await AppointmentModel.find({
      proveedor: objectId, 
      horaInicio: {
        $gte: startOfDay, 
        $lte: endOfDay    
      },
      estado: { $nin: ['cancelada', 'completada'] } // se deberia aumentar pendiente si este no es un bloqueo para el prooveedor
    //estado: { $nin: ['cancelada', 'completada', 'pendiente'] }  si el estado pendiente no bloquea la disponibilidad 
    // osea que si pendiente no afecta que se pueda seguir eligiendo al horario de esa cita
    }, 'horaInicio horaFin').lean().exec();

    // 4. ALGORITMO DE CÁLCULO DE DISPONIBILIDAD
    
    const allSlots = provider.horarios.flatMap(rangeString => {
        const [startTime, endTime] = rangeString.split('-');
        if (startTime && endTime) {
            return generateAllPossibleSlots(startTime, endTime, targetDate, DEFAULT_DURATION_MINUTES);
        }
        return [];
    });
    
    // Filtrar los slots disponibles
    const availableSlots = allSlots.filter(slot => {
      const isReserved = reservedAppointments.some(reserved => 
        // Llama a la función de superposición corregida (que usa getTime())
        checkOverlap(slot.start, slot.end, reserved.horaInicio, reserved.horaFin) 
      );
      return !isReserved; 
    });

    // 5. DEVOLVER RESPUESTA EN FORMATO REQUERIDO
    return {
      providerId,
      date: isoDateString,
      slots: availableSlots.map(slot => 
        `${slot.start.getUTCHours().toString().padStart(2, '0')}:${slot.start.getUTCMinutes().toString().padStart(2, '0')}`
      ),
    };
};

// ** FUNCIONES DE UTILIDAD 

interface SlotTime {
    start: Date;
    end: Date;
}

function generateAllPossibleSlots(startTime: string, endTime: string, date: Date, duration: number): SlotTime[] {
    const slots: SlotTime[] = [];
    
    const parseTime = (time: string, baseDate: Date): Date => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(); 
        newDate.setUTCFullYear(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate());
        newDate.setUTCHours(hours, minutes, 0, 0);
        
        return newDate;
    };

    let current = parseTime(startTime, date);
    let end = parseTime(endTime, date);

    while (current.getTime() < end.getTime())  {
        let slotEnd = new Date(current);
        slotEnd.setUTCMinutes(current.getUTCMinutes() + duration);

        if (slotEnd.getTime() <= end.getTime()) { 
              slots.push({
                start: new Date(current),
                end: slotEnd 
            });
        }
        current = slotEnd; 
    }
    return slots;
}

// Verifica si dos rangos de tiempo se superponen.
function checkOverlap(slotStart: Date, slotEnd: Date, reservedStart: Date, reservedEnd: Date): boolean {
    const slotStartTime = Math.floor(slotStart.getTime() / 1000); 
    const slotEndTime = Math.floor(slotEnd.getTime() / 1000); 
    
    const reservedStartTime = Math.floor(reservedStart.getTime() / 1000);
    const reservedEndTime = Math.floor(reservedEnd.getTime() / 1000);

   
    if (slotStart.getUTCHours() === 9 && slotStart.getUTCMinutes() === 0) {
      const isOverlapping = slotStartTime < reservedEndTime && slotEndTime > reservedStartTime;}
      
    
    // Lógica correcta de superposición
    return slotStartTime < reservedEndTime && slotEndTime > reservedStartTime;
}