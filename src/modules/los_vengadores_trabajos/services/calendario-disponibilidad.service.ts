//src/modules/los_vengadores_trabajos/services/calendario-disponibilidad.service.ts

import { HorarioDisponible, DiaDisponibilidad } from '../types/index';

const mockProveedores = [
  { _id: "proveedor_123", nombre: "Juan Perez", profesion: "Electricista" },
  { _id: "proveedor_456", nombre: "Maria Rojas", profesion: "Plomeria" },
  { _id: "proveedor_789", nombre: "Sergio Romero", profesion: "Cerrajería" },
];

const mockClientes = [
  { _id: "cliente_abc", nombre: "Ana Garcia" },
  { _id: "cliente_def", nombre: "Carlos Mendez" },
  { _id: "cliente_ghi", nombre: "Elena Vargas" },
];

// "BASE DE DATOS" FALSA - Datos de ejemplo para Juan Pérez
const mockTrabajosSolicitados: { proveedorId: string, clienteId: string, fecha: string, horaInicio: string, horaFin: string, estado: string }[] = [
  { proveedorId: "proveedor_123", clienteId: "cliente_abc", fecha: '2025-10-29', horaInicio: '08:00', horaFin: '12:00', estado: 'Confirmado' },
  { proveedorId: "proveedor_123", clienteId: "cliente_def", fecha: '2025-10-30', horaInicio: '15:00', horaFin: '19:00', estado: 'Pendiente' },
  { proveedorId: "proveedor_456", clienteId: "cliente_ghi", fecha: '2025-10-29', horaInicio: '07:00', horaFin: '11:00', estado: 'Confirmado' }
];

const mockHorariosDisponibles: { proveedorId: string, fecha: string, horaInicio: string, horaFin: string, costoHora: number }[] = [
  { proveedorId: "proveedor_123", fecha: '2025-10-14', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-14', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-15', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-15', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-16', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-16', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-17', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-17', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-18', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-18', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-19', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-19', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-20', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-20', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-21', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-21', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-22', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-22', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-23', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-23', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
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
  { proveedorId: "proveedor_123", fecha: '2025-10-30', horaInicio: '08:00', horaFin: '12:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-30', horaInicio: '14:00', horaFin: '18:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-31', horaInicio: '09:00', horaFin: '13:00', costoHora: 25 },
  { proveedorId: "proveedor_123", fecha: '2025-10-31', horaInicio: '15:00', horaFin: '19:00', costoHora: 25 },
  { proveedorId: "proveedor_456", fecha: '2025-10-29', horaInicio: '07:00', horaFin: '11:00', costoHora: 20 },
  { proveedorId: "proveedor_456", fecha: '2025-10-29', horaInicio: '13:00', horaFin: '17:00', costoHora: 20 }
  
];
// Resolver proveedorId: acepta tanto ID interno como slug amigable
function resolverProveedorId(busqueda: string): string | null {
  // 1. Buscar directamente por _id
  const porId = mockProveedores.find(p => p._id === busqueda);
  if (porId) return porId._id;
  
  // 2. Buscar por nombre (case-insensitive)
  const porNombre = mockProveedores.find(
    p => p.nombre.toLowerCase() === busqueda.toLowerCase()
  );
  if (porNombre) return porNombre._id;
  
  // 3. Buscar por slug (nombre con guiones, ej: "juan-perez")
  const porSlug = mockProveedores.find(p => {
    const slug = p.nombre.toLowerCase().replace(/\s+/g, '-');
    return slug === busqueda.toLowerCase();
  });
  if (porSlug) return porSlug._id;
  
  return null; // No encontrado
}

// --- FUNCIONES AUXILIARES ---

// Verificar si un horario se solapa con trabajos solicitados
function horarioEstaSolapado(
  proveedorId: string,
  fecha: string,
  horaInicio: string,
  horaFin: string
): boolean {
  // Buscar trabajos del proveedor en esa fecha que no estén cancelados
  const trabajosEnFecha = mockTrabajosSolicitados.filter(
    t => t.proveedorId === proveedorId && 
         t.fecha === fecha && 
         t.estado !== "Cancelado"
  );

  // Verificar si hay solapamiento con algún trabajo
  for (const trabajo of trabajosEnFecha) {
    // Convertir a minutos para comparar más fácil
    const inicioHorario = convertirHoraAMinutos(horaInicio);
    const finHorario = convertirHoraAMinutos(horaFin);
    const inicioTrabajo = convertirHoraAMinutos(trabajo.horaInicio);
    const finTrabajo = convertirHoraAMinutos(trabajo.horaFin);

    // Hay solapamiento si:
    // El inicio del horario está dentro del trabajo O
    // El fin del horario está dentro del trabajo O
    // El horario contiene completamente al trabajo
    if (
      (inicioHorario >= inicioTrabajo && inicioHorario < finTrabajo) ||
      (finHorario > inicioTrabajo && finHorario <= finTrabajo) ||
      (inicioHorario <= inicioTrabajo && finHorario >= finTrabajo)
    ) {
      return true; // Hay solapamiento
    }
  }

  return false; // No hay solapamiento
}

// Convertir hora en formato HH:MM a minutos totales
function convertirHoraAMinutos(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

export class DisponibilidadService {

   // Obtener calendario mensual (qué días tienen disponibilidad REAL)
    static async obtenerCalendarioMensual(
  proveedorBusqueda: string, 
  mes: number, 
  anio: number
): Promise<DiaDisponibilidad[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Resolver el ID real del proveedor
  const proveedorId = resolverProveedorId(proveedorBusqueda);
  if (!proveedorId) {
    console.log(`❌ Proveedor no encontrado: ${proveedorBusqueda}`);
    return []; // Devolver calendario vacío si no existe
  }
  
  console.log(`📅 Consultando calendario: Proveedor ${proveedorId} (búsqueda: ${proveedorBusqueda}), Mes ${mes}, Año ${anio}`);

    // Generar todos los días del mes
    const diasEnMes = new Date(anio, mes, 0).getDate();
    const calendario: DiaDisponibilidad[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      const fechaObj = new Date(anio, mes - 1, dia);
      
      // Solo mostrar días futuros o de hoy
      if (fechaObj < hoy) {
        // Días pasados: sin horarios disponibles
        calendario.push({
          fecha,
          horarios: []
        });
      } else {
        // Buscar horarios del proveedor en esta fecha
        const horariosDelDia = mockHorariosDisponibles.filter(
          h => h.proveedorId === proveedorId && h.fecha === fecha
        );
        
        // Filtrar solo horarios que NO están solapados
        const horariosLibres = horariosDelDia
          .filter(horario => 
            !horarioEstaSolapado(
              proveedorId, 
              fecha, 
              horario.horaInicio, 
              horario.horaFin
            )
          )
          .map(h => ({
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
            costoHora: h.costoHora
          }))
          .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
        
        // Agregar el día con sus horarios (puede ser array vacío si no hay)
        calendario.push({
          fecha,
          horarios: horariosLibres
        });
      }
    }
    
    return calendario;
  }

// Obtener horarios de un día específico (solo los disponibles)
  static async obtenerHorariosDia(
  proveedorBusqueda: string, 
  fecha: string
): Promise<{fecha: string, horarios?: HorarioDisponible[], mensaje?: string}> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Resolver el ID real del proveedor
  const proveedorId = resolverProveedorId(proveedorBusqueda);
  if (!proveedorId) {
    return {
      fecha,
      mensaje: "Proveedor no encontrado"
    };
  }
  
  console.log(`⏰ Consultando horarios: Proveedor ${proveedorId} (búsqueda: ${proveedorBusqueda}), Fecha ${fecha}`);
    
    // Normalizar fecha
    const partes = fecha.split('-');
    const fechaNormalizada = partes.length === 3 
      ? `${partes[0]}-${partes[1].padStart(2, '0')}-${partes[2].padStart(2, '0')}`
      : fecha;
    
    // Buscar horarios del proveedor en esta fecha
    const horariosDelDia = mockHorariosDisponibles.filter(
      h => h.proveedorId === proveedorId && h.fecha === fechaNormalizada
    );
    
    if (horariosDelDia.length === 0) {
      return {
        fecha: fechaNormalizada,
        mensaje: "No hay horarios disponibles para este día"
      };
    }
    
    // Filtrar solo los horarios que NO están solapados con trabajos
    const horariosDisponibles = horariosDelDia
      .filter(horario => 
        !horarioEstaSolapado(
          proveedorId, 
          fechaNormalizada, 
          horario.horaInicio, 
          horario.horaFin
        )
      )
      .map(h => ({
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        costoHora: h.costoHora
      }));
    
    if (horariosDisponibles.length === 0) {
      return {
        fecha: fechaNormalizada,
        mensaje: "Todos los horarios de este día están ocupados"
      };
    }
    
    // Ordenar cronológicamente
    const horariosOrdenados = horariosDisponibles.sort((a, b) => 
      a.horaInicio.localeCompare(b.horaInicio)
    );
    
    return {
      fecha: fechaNormalizada,
      horarios: horariosOrdenados
    };
  }


// Obtener información del proveedor
static async obtenerInfoProveedor(busqueda: string) {
  // Buscar por _id o por nombre (insensible a mayúsculas/minúsculas)
  const proveedor = mockProveedores.find(
    p => p._id === busqueda || p.nombre.toLowerCase() === busqueda.toLowerCase()
  );

  if (!proveedor) {
    return {
      nombre: 'Proveedor No Encontrado',
      profesion: 'Servicio',
      calificacion: 0,
      descripcion: 'Este proveedor no existe en el sistema'
    };
  }

  return {
    nombre: proveedor.nombre,
    profesion: proveedor.profesion,
    descripcion: `Especialista en ${proveedor.profesion.toLowerCase()}`
  };
}
}

