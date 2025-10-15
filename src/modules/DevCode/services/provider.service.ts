import connectDB from "@/config/database";
import mongoose from "mongoose";
import  { Types } from "mongoose";
import usuario from "../models/usuario";
import Appointment from "../models/Appointment";
import Provider from "../models/Provider";
import { toLocalParts } from "../utils/time"; 

export  const getUsuariosSinModelo = async () => {
    try {
        await connectDB();
        const usuarios = await usuario.find().select("-password -__v");
        return [usuarios ]


    } catch (error) {
        console.error(error)
    }finally{
        await mongoose.disconnect();
    }
}

export const getProviders = async () => {
  await connectDB();

  const rows = await Appointment.aggregate([
    { $match: {} },
    {
      $group: {
        _id: "$proveedor",
        totalCitas: { $sum: 1 },
        primeraCita: { $min: "$fecha" },
        ultimaCita: { $max: "$fecha" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Normaliza salida
  return rows.map((r) => ({
    _id: r._id,                 // ObjectId del proveedor
    totalCitas: r.totalCitas,
    primeraCita: r.primeraCita,
    ultimaCita: r.ultimaCita,
  }));
};

export const getProviderById = async (id: string) => {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    const e: any = new Error("ID inválido");
    e.status = 400;
    throw e;
  }

  const exists = await Appointment.exists({ proveedor: new Types.ObjectId(id) });
  if (!exists) {
    const e: any = new Error("Proveedor no encontrado (sin citas asociadas)");
    e.status = 404;
    throw e;
  }

  
  const citasraw = await Appointment.find({
    proveedor: id,
    estado: { $in: ["pendiente", "confirmada"] },
  })
    .populate("cliente", "name lastName")
    .select("-__v -notas")
    .lean();

  // Agregar campos locales
  const citas = citasraw.map((c: any) => {
    const ini = toLocalParts(new Date(c.horaInicio));
    const fin = toLocalParts(new Date(c.horaFin));
    return {
      ...c,
      horaInicioLocal: `${ini.date} ${ini.time}`,
      horaFinLocal: `${fin.date} ${fin.time}`,
    };
  });
  const provider = {
    _id: id,
    user: null,
    horarios: [],          
    servicios: [],
    rating: null,
    trabajosCompletados: null,
  };
  

  return { provider, citas };
};

function hmToMinutes(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function buildSlotsForWindow(
  dayUTC: Date,
  startHM: string,
  endHM: string,
  slotMinutes: number
): { start: Date; end: Date }[] {
  const y = dayUTC.getUTCFullYear();
  const m = dayUTC.getUTCMonth();
  const d = dayUTC.getUTCDate();
  const startMin = hmToMinutes(startHM);
  const endMin = hmToMinutes(endHM);
  const out: { start: Date; end: Date }[] = [];
  for (let t = startMin; t + slotMinutes <= endMin; t += slotMinutes) {
    const sh = Math.floor(t / 60), sm = t % 60;
    const eh = Math.floor((t + slotMinutes) / 60), em = (t + slotMinutes) % 60;
    out.push({
      start: new Date(Date.UTC(y, m, d, sh, sm, 0, 0)),
      end:   new Date(Date.UTC(y, m, d, eh, em, 0, 0)),
    });
  }
  return out;
}

function mergeIntervals(intervals: { start: Date; end: Date }[]) {
  if (!intervals.length) return [];
  const arr = intervals
    .map(i => ({ start: new Date(i.start), end: new Date(i.end) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: { start: Date; end: Date }[] = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    const prev = merged[merged.length - 1];
    const cur = arr[i];
    if (cur.start <= prev.end) prev.end = new Date(Math.max(+prev.end, +cur.end));
    else merged.push(cur);
  }
  return merged;
}

function subtractBusyFromSlots(
  slots: { start: Date; end: Date }[],
  busy: { start: Date; end: Date }[]
) {
  if (!busy.length) return slots;
  return slots.filter(s =>
    !busy.some(b => Math.max(+s.start, +b.start) < Math.min(+s.end, +b.end))
  );
}

// --------- GETS SOLO CON APPOINTMENTS ----------

// 1) OCUPADOS
export async function getBusySlotsForProvider(
  providerId: string,
  date: string
): Promise<{ horaInicio: Date; horaFin: Date }[]> {
  await connectDB();

  if (!Types.ObjectId.isValid(providerId)) {
    const e: any = new Error("ID de proveedor inválido");
    e.status = 400; throw e;
  }

  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay   = new Date(`${date}T23:59:59.999Z`);

  const appts = await Appointment.find({
    proveedor: new Types.ObjectId(providerId),
    estado: { $in: ["pendiente", "confirmada"] },
    $or: [{ horaInicio: { $lte: endOfDay }, horaFin: { $gte: startOfDay } }],
  }).select("horaInicio horaFin").lean();

  return appts.map(a => ({ horaInicio: a.horaInicio, horaFin: a.horaFin }));
}

// 2) DISPONIBLES (sin Provider.horarios)
// - Usa horarios por defecto o los que pases por query: "hours=08:00-12:00,14:00-18:00"
export async function getAvailableSlotsForProvider(
  providerId: string,
  date: string,
  slotMinutes = 30,
  hoursCSV?: string // opcional "HH:mm-HH:mm,HH:mm-HH:mm"
): Promise<{ busy: { start: Date; end: Date }[]; available: { start: Date; end: Date }[] }> {
  await connectDB();

  if (!Types.ObjectId.isValid(providerId)) {
    const e: any = new Error("ID de proveedor inválido");
    e.status = 400; throw e;
  }

  // 1) Construir la ventana laboral del día
  const DEFAULT_HOURS = "08:00-12:00,14:00-18:00";
  const hours = (hoursCSV || DEFAULT_HOURS)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const dayUTC = new Date(`${date}T00:00:00.000Z`);
  let laborSlots: { start: Date; end: Date }[] = [];
  for (const tramo of hours) {
    const [a, b] = tramo.split("-");
    if (a && b) laborSlots = laborSlots.concat(buildSlotsForWindow(dayUTC, a, b, slotMinutes));
  }

  // 2) Ocupados desde appointments
  const busyAppts = await getBusySlotsForProvider(providerId, date);
  const busy = mergeIntervals(
    busyAppts.map(b => ({ start: new Date(b.horaInicio), end: new Date(b.horaFin) }))
  );

  // 3) Filtrar disponibles
  const available = subtractBusyFromSlots(laborSlots, busy);
  return { busy, available };
}

