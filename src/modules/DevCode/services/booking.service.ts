import Appointment, { AppointmentDocument, AppointmentStatus } from '../models/Appointments';
import Provider from '../../../models/provider.model';
import User from '../../../models/user.model';
import { getAvailabilityService } from './availabilily.service';

export interface CreateBookingPayload {
  clientId: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  durationMinutes: number;
  location: string;
  notes?: string;
}

const STEP_MINUTES = 30;

const toUTCDate = (dateStr: string, timeStr?: string): Date => {
  const t = timeStr ? `${timeStr}:00` : '00:00:00';
  return new Date(`${dateStr}T${t}.000Z`);
};

const hhmmToMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const minutesToHHMM = (mins: number): string => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const expandSlots = (startHHMM: string, endHHMM: string, step = STEP_MINUTES): string[] => {
  const start = hhmmToMinutes(startHHMM);
  const end = hhmmToMinutes(endHHMM);
  const slots: string[] = [];
  for (let t = start; t < end; t += step) {
    slots.push(minutesToHHMM(t));
  }
  return slots;
};

export const createBooking = async (payload: CreateBookingPayload): Promise<AppointmentDocument> => {
  const { clientId, providerId, date, startTime, endTime, durationMinutes, location, notes } = payload;

  const [client, provider] = await Promise.all([
    User.findById(clientId),
    Provider.findById(providerId),
  ]);

  if (!client) {
    const err: any = new Error('Cliente no existe');
    err.status = 404; throw err;
  }
  if (!provider) {
    const err: any = new Error('Proveedor no existe');
    err.status = 404; throw err;
  }

  const dateOnly = toUTCDate(date);
  const startAt = toUTCDate(date, startTime);
  const endAt = toUTCDate(date, endTime);

  if (!(endAt > startAt)) {
    const err: any = new Error('endTime debe ser mayor que startTime');
    err.status = 400; throw err;
  }

  // =============================
  // Aqui modulo de Disponibilidad
  // =============================
  // El servicio retorna las horas libres (slots HH:MM) considerando
  // horarios configurados y citas existentes; aquí solo verificamos el rango.
  const { slots: availableSlots } = await getAvailabilityService(providerId, date);

  const requestedSlots = expandSlots(startTime, endTime, STEP_MINUTES);
  const isAvailable = requestedSlots.every(slot => availableSlots.includes(slot));
  if (!isAvailable) {
    const err: any = new Error('Horario no disponible');
    err.status = 409; throw err;
  }

  const booking = new Appointment({
    cliente: client._id,
    proveedor: provider._id,
    fecha: dateOnly,
    horaInicio: startAt,
    horaFin: endAt,
    duracionMinutos: Number(durationMinutes),
    ubicacion: String(location),
    notas: notes ? String(notes) : undefined,
    estado: 'pendiente',
  });

  return booking.save();
};

export const getBookingById = async (id: string) => {
  return Appointment.findById(id)
    .populate('cliente', 'name email')
    .populate('proveedor');
};

export const updateBookingStatus = async (id: string, status: AppointmentStatus) => {
  const allowed: AppointmentStatus[] = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  if (!allowed.includes(status)) {
    const err: any = new Error('Estado invalido');
    err.status = 400; throw err;
  }
  const booking = await Appointment.findById(id);
  if (!booking) {
    const err: any = new Error('Cita no encontrada');
    err.status = 404; throw err;
  }

  booking.estado = status as any;
  return booking.save();
};
