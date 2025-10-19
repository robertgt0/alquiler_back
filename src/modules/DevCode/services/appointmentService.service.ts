import { Appointment, AppointmentDocument } from "../models/appointment.model";
import { Calendario } from "@models/calendario.model";
import { ProveedorInfo } from "@models/proveedorInfo.model";
import { Types, isValidObjectId } from "mongoose";

interface SlotTime {
    start: Date;
    end: Date;
}
interface AvailabilityQuery {
    proveedorId: string;
    fecha: string; // YYYY-MM-DD
}
export interface AvailabilityResponse {
    proveedorId: string;
    fecha: string;
    slots: string[];
}
const DEFAULT_DURATION_MINUTES = 30;

export const createAppointmentAndBlockTime = async (data: any): Promise<AppointmentDocument> => {
    
    const nuevaCita = await Appointment.create(data); 

    await Calendario.updateOne(
        { proveedor: data.proveedor },
        { $push: { fechas_ocupadas: data.horaInicio } }, 
        { upsert: true }
    );

    return nuevaCita;
};



 //Calcula los slots disponibles para un proveedor en una fecha específica.

export const checkProviderAvailability = async (
    { proveedorId, fecha: dateString }: AvailabilityQuery
): Promise<AvailabilityResponse> => {
    
    // 1. VALIDACIÓN Y PREPARACIÓN DE ENTRADA
    if (!isValidObjectId(proveedorId)) {
        throw new Error('ID de proveedor inválido.');
    }
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
        throw new Error('Fecha inválida. Use el formato YYYY-MM-DD.');
    }
    const isoDateString = targetDate.toISOString().slice(0, 10); 
    const objectId = new Types.ObjectId(proveedorId); 

    // 2. CONSULTAR HORARIO LABORAL (ProveedorInfo)
    const providerInfo = await ProveedorInfo.findOne({ usuario: objectId }, 'horarios').lean().exec(); 
    
    if (!providerInfo || !providerInfo.horarios || providerInfo.horarios.length === 0) {
        return { proveedorId: proveedorId, fecha: isoDateString, slots: [] }; 
    }
    
    // 3. CONSULTAR CITAS OCUPADAS (Appointment)
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const reservedAppointments = await Appointment.find({
        proveedor: objectId, 
        horaInicio: { $gte: startOfDay, $lte: endOfDay },
        estado: { $nin: ['cancelada', 'completada'] } 
    }, 'horaInicio horaFin').lean().exec();

    // 4. ALGORITMO DE CÁLCULO
    const dayOfWeek = targetDate.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase();
    const daySchedule = providerInfo.horarios
        .filter(h => h.dia.toLowerCase() === dayOfWeek)
        .map(h => `${h.hora_inicio}-${h.hora_fin}`);
    
    if (daySchedule.length === 0) {
        return { proveedorId: proveedorId, fecha: isoDateString, slots: [] };
    }

    const allSlots = daySchedule.flatMap(rangeString => {
        const [startTime, endTime] = rangeString.split('-');
        if (startTime && endTime) {
            return generateAllPossibleSlots(startTime, endTime, targetDate, DEFAULT_DURATION_MINUTES);
        }
        return [];
    });
    
    // Filtrar los slots disponibles
    const availableSlots = allSlots.filter(slot => {
        const isReserved = reservedAppointments.some(reserved => 
            checkOverlap(slot.start, slot.end, reserved.horaInicio, reserved.horaFin) 
        );
        return !isReserved; 
    });

    // 5. DEVOLVER RESPUESTA
    return {
        proveedorId: proveedorId,
        fecha: isoDateString,
        slots: availableSlots.map(slot => 
            `${slot.start.getUTCHours().toString().padStart(2, '0')}:${slot.start.getUTCMinutes().toString().padStart(2, '0')}`
        ),
    };
};

function generateAllPossibleSlots(startTime: string, endTime: string, date: Date, duration: number): SlotTime[] {
    const slots: SlotTime[] = [];
    
    const parseTime = (time: string, baseDate: Date): Date => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(baseDate); 
        newDate.setUTCFullYear(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate());
        newDate.setUTCHours(hours, minutes, 0, 0);
        
        return newDate;
    };

    let current = parseTime(startTime, date);
    let end = parseTime(endTime, date);

    while (current.getTime() < end.getTime())  {
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

function checkOverlap(slotStart: Date, slotEnd: Date, reservedStart: Date, reservedEnd: Date): boolean {
    const slotStartTime = Math.floor(slotStart.getTime() / 1000); 
    const slotEndTime = Math.floor(slotEnd.getTime() / 1000); 
    
    const reservedStartTime = Math.floor(reservedStart.getTime() / 1000);
    const reservedEndTime = Math.floor(reservedEnd.getTime() / 1000);

    return slotStartTime < reservedEndTime && slotEndTime > reservedStartTime;
}