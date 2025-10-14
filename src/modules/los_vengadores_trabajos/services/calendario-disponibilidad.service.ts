//src/modules/los_vengadores_trabajos/services/calendario-disponibilidad.service.ts

import { HorarioDisponible, DiaDisponibilidad } from '../types/index';
import { DisponibilidadModel } from '../models/calendario-disponibilidad.model';

// "BASE DE DATOS" FALSA - Datos de ejemplo para Juan Pérez (tu mockup)
const mockDisponibilidad: Record<string, HorarioDisponible[]> = {
  // Septiembre 2025 - Juan Pérez (Electricista)
  '2025-10-29': [
    { horaInicio: '08:00', horaFin: '12:00', costoHora: 25, disponible: true },
    { horaInicio: '14:00', horaFin: '18:00', costoHora: 25, disponible: true },
    { horaInicio: '20:00', horaFin: '23:00', costoHora: 35, disponible: true }
  ],
  '2025-10-30': [
    { horaInicio: '09:00', horaFin: '13:00', costoHora: 25, disponible: true },
    { horaInicio: '15:00', horaFin: '19:00', costoHora: 25, disponible: true }
  ],
  '2025-10-14': [
    { horaInicio: '08:00', horaFin: '12:00', costoHora: 25, disponible: true },
    { horaInicio: '14:00', horaFin: '18:00', costoHora: 25, disponible: false } // No disponible
  ],
  '2025-10-15': [
    { horaInicio: '10:00', horaFin: '14:00', costoHora: 30, disponible: true }
  ]
};

// Datos de otros proveedores de ejemplo
const mockDisponibilidadCarlos: Record<string, HorarioDisponible[]> = {
  '2025-09-29': [
    { horaInicio: '07:00', horaFin: '11:00', costoHora: 20, disponible: true },
    { horaInicio: '13:00', horaFin: '17:00', costoHora: 20, disponible: true }
  ]
};

export class DisponibilidadService {
  
  // Obtener calendario mensual (qué días tienen disponibilidad)
  static async obtenerCalendarioMensual(proveedorId: string, mes: number, anio: number): Promise<DiaDisponibilidad[]> {
    // Simulamos un pequeño delay como si fuera base de datos real (criterio 7: < 2 segundos)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`📅 Consultando calendario: Proveedor ${proveedorId}, Mes ${mes}, Año ${anio}`);
    
    // Elegir qué datos usar según el proveedor (con tipo explícito)
    const datosProveedor: Record<string, HorarioDisponible[]> = 
      proveedorId === 'juan-perez' ? mockDisponibilidad : mockDisponibilidadCarlos;
    
    // Generar todos los días del mes
    const diasEnMes = new Date(anio, mes, 0).getDate(); // Último día del mes
    const calendario: DiaDisponibilidad[] = [];
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      const fechaObj = new Date(anio, mes - 1, dia);
      const hoy = new Date();
      
      // Criterio 8: Solo mostrar días futuros, no pasados
      if (fechaObj < hoy) {
        calendario.push({
          fecha,
          disponible: false
          // Quitamos esPasado porque no está en el tipo DiaDisponibilidad
        });
      } else {
        // Verificar si existe en nuestros datos falsos (con verificación de tipo segura)
        const tieneHorarios = fecha in datosProveedor && 
                             datosProveedor[fecha]?.some(h => h.disponible);
        
        calendario.push({
          fecha,
          disponible: !!tieneHorarios
        });
      }
    }
    
    return calendario;
  }

  // Obtener horarios de un día específico
  static async obtenerHorariosDia(proveedorId: string, fecha: string): Promise<{fecha: string, horarios?: HorarioDisponible[], mensaje?: string}> {
    // Simulamos delay (criterio 14: < 2 segundos)
    await new Promise(resolve => setTimeout(resolve, 150));
    
    console.log(`⏰ Consultando horarios: Proveedor ${proveedorId}, Fecha ${fecha}`);
    
    // Elegir datos según proveedor (con tipo explícito)
    const datosProveedor: Record<string, HorarioDisponible[]> = 
      proveedorId === 'juan-perez' ? mockDisponibilidad : mockDisponibilidadCarlos;

    // 🔹 Normalizar fecha a formato YYYY-MM-DD para evitar errores de coincidencia
    const partes = fecha.split('-');
    const fechaNormalizada = partes.length === 3 
      ? `${partes[0]}-${partes[1].padStart(2, '0')}-${partes[2].padStart(2, '0')}`
      : fecha;
    
    // Acceso seguro con verificación de existencia
    const horariosDelDia = fechaNormalizada in datosProveedor ? datosProveedor[fechaNormalizada] : undefined;
    
    // Criterio 4 y 17: Si no hay horarios, mostrar mensaje claro
    if (!horariosDelDia || horariosDelDia.length === 0) {
      return {
        fecha: fechaNormalizada,
        mensaje: "No hay horarios disponibles para este día"
      };
    }
    
    // Filtrar solo los horarios disponibles
    const horariosDisponibles = horariosDelDia.filter(h => h.disponible);
    
    if (horariosDisponibles.length === 0) {
      return {
        fecha: fechaNormalizada,
        mensaje: "No hay horarios disponibles para este día"
      };
    }
    
    // Criterio 11: Ordenar horarios cronológicamente
    const horariosOrdenados = horariosDisponibles.sort((a, b) => 
      a.horaInicio.localeCompare(b.horaInicio)
    );
    
    return {
      fecha: fechaNormalizada,
      horarios: horariosOrdenados
    };
  }

  // Método extra: Obtener información del proveedor
  static async obtenerInfoProveedor(proveedorId: string) {
    const proveedores: Record<string, {nombre: string, profesion: string, calificacion: number, descripcion: string}> = {
      'juan-perez': {
        nombre: 'Juan Pérez',
        profesion: 'Electricista',
        calificacion: 4.8,
        descripcion: 'Especialista en instalaciones eléctricas residenciales'
      },
      'carlos-lopez': {
        nombre: 'Carlos López',
        profesion: 'Plomero',
        calificacion: 4.5,
        descripcion: 'Reparación y mantenimiento de tuberías'
      }
    };
    
    return proveedores[proveedorId] || {
      nombre: 'Proveedor No Encontrado',
      profesion: 'Servicio',
      calificacion: 0,
      descripcion: 'Este proveedor no existe en el sistema'
    };
  }
}