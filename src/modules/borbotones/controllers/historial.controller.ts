import { Request, Response } from 'express'; // Importa los tipos Request y Response de Express para manejar solicitudes y respuestas HTTP
import { HistorialService } from '../services/historial.service'; // Importa el servicio que contiene la lógica para manejar el historial de búsquedas

// Controlador para obtener el historial de búsquedas
export const getHistorial = async (req: Request, res: Response) => {
  try {
    // Llama al servicio para obtener el historial de búsquedas según el usuario o la sesión
    const historial = await HistorialService.obtenerHistorial(req);
    // Envía la respuesta exitosa con el historial obtenido
    res.status(200).json({ success: true, historial });
  } catch (error) {
    // Muestra el error en consola si ocurre algún problema
    console.error('❌ Error al obtener historial:', error);
    // Devuelve un mensaje de error al cliente con código 500 (error interno)
    res.status(500).json({ success: false, message: 'Error al obtener el historial de búsquedas.' });
  }
};

// Controlador para limpiar (eliminar) el historial de búsquedas
export const limpiarHistorial = async (req: Request, res: Response) => {
  try {
    // Llama al servicio para borrar todo el historial de búsquedas
    await HistorialService.limpiarHistorial(req);
    // Envía una respuesta confirmando que se limpió correctamente
    res.status(200).json({ success: true, message: 'Historial limpiado correctamente.' });
  } catch (error) {
    // Muestra el error en consola si ocurre algún problema al limpiar el historial
    console.error('❌ Error al limpiar historial:', error);
    // Devuelve un mensaje de error al cliente con código 500 (error interno)
    res.status(500).json({ success: false, message: 'Error al limpiar el historial.' });
  }
};
