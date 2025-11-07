import mongoose from "mongoose";
import HorarioModel from "../models/horario.model";
import TrabajoSolicitadoModel from "../models/trabajo-solicitado.model";
import { HorarioDisponible } from "../types/index";

// --- MOCKS ---------------------------------------------------------

const mockProveedores = [
  { _id: "proveedor_123", nombre: "Juan Perez", profesion: "Electricista" },
  { _id: "proveedor_456", nombre: "Maria Rojas", profesion: "Plomería" },
  { _id: "proveedor_789", nombre: "Sergio Romero", profesion: "Cerrajería" },
];

const mockClientes = [
  { _id: "cliente_abc", nombre: "Ana Garcia" },
  { _id: "cliente_def", nombre: "Carlos Mendez" },
  { _id: "cliente_ghi", nombre: "Elena Vargas" },
];

const mockTrabajosSolicitados = [
  { proveedorId: "proveedor_123", clienteId: "cliente_abc", fecha: "2025-10-29", horaInicio: "10:00", horaFin: "13:00", estado: "Confirmado" },
  { proveedorId: "proveedor_123", clienteId: "cliente_def", fecha: "2025-10-30", horaInicio: "15:00", horaFin: "19:00", estado: "Pendiente" },
  //{ proveedorId: "proveedor_456", clienteId: "cliente_ghi", fecha: "2025-10-29", horaInicio: "07:00", horaFin: "11:00", estado: "Confirmado" },
];

const mockHorariosDisponibles = [
  { proveedorId: "proveedor_123", fecha: '2025-10-24', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-24', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-25', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-25', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-26', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-26', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-27', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-27', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-28', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-28', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-29', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-29', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-29', horaInicio: '20:00', horaFin: '21:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-30', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-30', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-31', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-31', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_456", fecha: '2025-10-29', horaInicio: '07:00', horaFin: '11:00', costoHora: 20 },
  { proveedorId: "proveedor_456", fecha: '2025-10-29', horaInicio: '13:00', horaFin: '17:00', costoHora: 20 },
  { proveedorId: "proveedor_456", fecha: "2025-10-29", horaInicio: "07:00", horaFin: "11:00", costoHora: 20 },
];

// ------------------------------------------------------------------

// 🔌 Verifica conexión con la base de datos
async function hayConexionBD(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  console.warn("⚠️ No hay conexión activa con MongoDB, usando mocks.");
  return false;
}

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
        costoHora: 25,
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
      costoHora: 25,
    });
  }

  return disponibles;
}

// ------------------------------------------------------------------

export class DisponibilidadService {
  // Obtiene horarios de un proveedor para un día, aplicando fragmentación
  static async obtenerHorariosDia(proveedorBusqueda: string, fecha: string) {
    const usarBD = await hayConexionBD();

    if (usarBD) {
      try {
        const horariosBD = await HorarioModel.find({ fecha }).sort({ horaInicio: 1 });
        const trabajosBD = await TrabajoSolicitadoModel.find({ fecha });

        if (!horariosBD.length) return { fecha, mensaje: "No existen horarios disponibles" };

        const trabajosSimplificados = trabajosBD.map(t => ({
          horaInicio: t.hora_inicio,
          horaFin: t.hora_fin,
        }));

        const fragmentados = horariosBD.flatMap(h =>
          fragmentarHorarioPorSolapamientos(h.horaInicio, h.horaFin, trabajosSimplificados).map(f => ({
            ...f,
            costoHora: h.costo
          }))
        );

        if (!fragmentados.length) return { fecha, mensaje: "Todos los horarios ocupados" };

        return { fecha, horarios: fragmentados.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)) };
      } catch (err) {
        console.error("❌ Error en BD, usando mocks:", err);
      }
    }
    return this.obtenerHorariosDiaMock(proveedorBusqueda, fecha);
  }

  // Versión mock
  static async obtenerHorariosDiaMock(proveedorBusqueda: string, fecha: string) {
    await new Promise(r => setTimeout(r, 100));

    const proveedor = mockProveedores.find(
      p =>
        p._id === proveedorBusqueda ||
        p.nombre.toLowerCase() === proveedorBusqueda.toLowerCase() ||
        p.nombre.toLowerCase().replace(/\s+/g, "-") === proveedorBusqueda.toLowerCase()
    );

    if (!proveedor) return { fecha, mensaje: "Proveedor no encontrado (mock)" };

    const horariosDia = mockHorariosDisponibles.filter(
      h => h.proveedorId === proveedor._id && h.fecha === fecha
    );

    const trabajosDia = mockTrabajosSolicitados.filter(
      t => t.proveedorId === proveedor._id && t.fecha === fecha && t.estado !== "Cancelado"
    );

    if (!horariosDia.length) return { fecha, mensaje: "No hay horarios disponibles" };

    const fragmentados = horariosDia.flatMap(h =>
      fragmentarHorarioPorSolapamientos(h.horaInicio, h.horaFin, trabajosDia).map(f => ({
        ...f,
        costoHora: h.costoHora
      }))
    );

    if (!fragmentados.length) return { fecha, mensaje: "Todos los horarios ocupados" };

    return { fecha, horarios: fragmentados.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)) };
  }

  // ---------------------------------------------
  // INFO PROVEEDOR
  // ---------------------------------------------
  static async obtenerInfoProveedor(busqueda: string) {
    const usarBD = await hayConexionBD();

    if (usarBD) {
      return {
        nombre: "Juan Perez",
        profesion: "Electricista",
        descripcion: "Datos obtenidos desde la base de datos.",
      };
    }

    return this.obtenerInfoProveedorMock(busqueda);
  }

  static async obtenerInfoProveedorMock(busqueda: string) {
    const proveedor = mockProveedores.find(
      p =>
        p._id === busqueda ||
        p.nombre.toLowerCase() === busqueda.toLowerCase() ||
        p.nombre.toLowerCase().replace(/\s+/g, "-") === busqueda.toLowerCase()
    );

    if (!proveedor) return {
      nombre: "Proveedor No Encontrado",
      profesion: "Servicio",
      descripcion: "Este proveedor no existe en el sistema",
    };

    return {
      nombre: proveedor.nombre,
      profesion: proveedor.profesion,
      descripcion: `Especialista en ${proveedor.profesion.toLowerCase()}`,
    };
  }
}
