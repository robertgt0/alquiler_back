import { Request } from 'express';
import Historial, { IHistorial } from '../models/Historial';

/**
 * 🔹 Servicio: HistorialService
 * Este servicio se encarga de gestionar las operaciones relacionadas con el historial de búsquedas.
 * Se comunica con el modelo `Historial` (MongoDB) para guardar, obtener o limpiar los datos.
 */
export class HistorialService {
  
  /**
   * ✅ Guardar búsqueda en historial
   * 
   * Este método guarda un término de búsqueda cada vez que un usuario busca algo en el frontend.
   * 
   * @param req - Objeto de la petición HTTP (no se usa directamente aquí, pero se puede usar en el futuro para identificar usuarios)
   * @param termino - Texto que el usuario escribió en la barra de búsqueda
   */
  static async guardarBusqueda(req: Request, termino: string) {
    try {
      // Si el término es vacío o menor a 2 caracteres, no se guarda (para evitar ruido)
      if (!termino || termino.trim().length < 2) return;

      // Crea un nuevo documento en MongoDB con el término y la fecha actual
      await Historial.create({ termino: termino.trim() });
    } catch (error) {
      console.error('❌ Error al guardar historial:', error);
    }
  }

  /**
   * ✅ Obtener historial
   * 
   * Este método devuelve las últimas 10 búsquedas guardadas.
   * 
   * 📌 El frontend puede usar este método para mostrar sugerencias recientes
   * cuando el usuario hace clic o enfoca la barra de búsqueda.
   * 
   * @param req - Objeto de la petición HTTP (reservado para futuras mejoras)
   * @returns Array con los últimos 10 registros del historial
   */
  static async obtenerHistorial(req: Request): Promise<IHistorial[]> {
    try {
      // Busca en la colección "historial", ordena por fecha descendente y limita a 10
      return await Historial.find().sort({ fecha: -1 }).limit(10);
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      return [];
    }
  }

  /**
   * ✅ Limpiar historial
   * 
   * Este método borra todos los registros del historial de búsqueda.
   * 
   * 📌 Puede usarse en el frontend, por ejemplo, desde un botón "Limpiar historial".
   * 
   * @param req - Objeto de la petición HTTP
   */
  static async limpiarHistorial(req: Request) {
    try {
      // Elimina todos los documentos en la colección
      await Historial.deleteMany({});
    } catch (error) {
      console.error('❌ Error limpiando historial:', error);
    }
  }
}
