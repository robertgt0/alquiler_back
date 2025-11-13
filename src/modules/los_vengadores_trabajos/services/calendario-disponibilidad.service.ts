import mongoose from "mongoose";
import DisponibleModel from "../models/horario_disponible.model";
import Trabajo from "../models/trabajo.model";
import ProveedorModel from "../models/proveedor.model";
import { HorarioDisponible } from "../types/index";
import { IServicio } from "../models/servicio.model";

// --- FUNCIONES AUXILIARES -----------------------------------------

function convertirHoraAMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function convertirMinutosAHora(min: number): string {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

// ⚙️ Fragmenta un horario en partes libres según solapamientos
function fragmentarHorarioPorSolapamientos(
  inicio: string,
  fin: string,
  ocupados: { horaInicio: string; horaFin: string }[]
): HorarioDisponible[] {
  let disponibles: HorarioDisponible[] = [];
  let start = convertirHoraAMinutos(inicio);
  const end = convertirHoraAMinutos(fin);

  const ocupadosOrdenados = ocupados
    .map(o => ({
      inicio: convertirHoraAMinutos(o.horaInicio),
      fin: convertirHoraAMinutos(o.horaFin),
    }))
    .sort((a, b) => a.inicio - b.inicio);

  for (const occ of ocupadosOrdenados) {
    if (occ.fin <= start) continue; // no afecta
    if (occ.inicio >= end) break;   // fuera del rango

    // Fragmento libre antes del ocupado
    if (occ.inicio > start) {
      disponibles.push({
        horaInicio: convertirMinutosAHora(start),
        horaFin: convertirMinutosAHora(Math.min(occ.inicio, end)),
      });
    }

    // Avanzar start al final del ocupado
    start = Math.max(start, occ.fin);
  }

  // Fragmento final
  if (start < end) {
    disponibles.push({
      horaInicio: convertirMinutosAHora(start),
      horaFin: convertirMinutosAHora(end),
    });
  }

  return disponibles;
}

// ------------------------------------------------------------------

export class DisponibilidadService {
  // Obtiene horarios de un proveedor para un día, aplicando fragmentación
  static async obtenerHorariosDia(proveedorId: string, fecha: string) {
    try {
      // 🔹 Filtramos por proveedor y fecha
      const horariosBD = await DisponibleModel.find({ proveedorId, fecha }).sort({ horaInicio: 1 });
      const trabajosBD = await Trabajo.find(
        { id_proveedor: proveedorId, fecha, estado: { $in: ["pendiente", "en_proceso"] } }, // solo trabajos activos,
        { hora_inicio: 1, hora_fin: 1, _id: 0 } // solo traer horas de inicio y fin
      );

      if (!horariosBD.length) return { fecha, mensaje: "No existen horarios disponibles" };
      // 🔹 Fragmentamos los horarios según los trabajos ocupados
      const horariosLibres = horariosBD.flatMap(horario =>
        fragmentarHorarioPorSolapamientos(
          horario.horaInicio,
          horario.horaFin,
          trabajosBD.map(trabajo => ({
            horaInicio: trabajo.hora_inicio,
            horaFin: trabajo.hora_fin,
          }))
        )
      );


      if (!horariosLibres.length) return { fecha, mensaje: "Todos los horarios ocupados" };

      return {
        fecha,
        horarios: horariosLibres.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
      };
    } catch (err) {
      console.error("❌ Error en BD, usando mocks:", err);
      return { fecha, mensaje: "Error al obtener horarios" };
    }
  }
  // ---------------------------------------------
  // INFO PROVEEDOR
  // ---------------------------------------------
  static async obtenerInfoProveedor(proveedorId: string) {
    try {
      const proveedor = await ProveedorModel.findById(proveedorId).populate<{
      servicios: IServicio[];
    }>("servicios");

      if (!proveedor) {
      return { mensaje: "Proveedor no encontrado", nombre: "", profesion: "" };
    }
    const servicios = proveedor.servicios
      .map(s => s.nombre_servicio?.trim())
      .filter(Boolean);

    const profesiones =
      servicios.length > 1 ? servicios.join(", ") : (servicios[0] || "");
    return {
      nombre: proveedor.nombre,
      profesion: profesiones
    };
  } catch (error: any) {
    console.error("Error al obtener info del proveedor:", error.message);
    return { mensaje: "Error al obtener información del proveedor", nombre: "", profesion: "" };
  }
}
}
  
