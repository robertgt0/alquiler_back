import { Request, Response } from 'express';
import * as fixerService from '../services/Fixer.service';
import * as trabajoService from '../services/trabajo.service';

// Obtiene trabajos por nombre de usuario del fixer
export const handleGetTrabajosByUsuario = async (req: Request, res: Response) => {
  const { usuario } = req.params;
  
  try {
    const fixer = await fixerService.getFixerByUsuario(usuario);

    if (!fixer) {
      return res.status(404).json({ success: false, message: `Fixer con usuario '${usuario}' no encontrado.` });
    }

    const trabajos = await trabajoService.getTrabajosByFixerId(fixer._id);

    res.status(200).json(trabajos); // Devuelve el array de trabajos

  } catch (error: any) {
    console.error(`Error al obtener trabajos para ${usuario}:`, error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

/**
 * Manejador para pagar un trabajo en efectivo
 */
export const handlePagarTrabajoEfectivo = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del *trabajo*

  try {
    const trabajoActualizado = await trabajoService.pagarTrabajoEfectivo(id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Trabajo pagado exitosamente.',
      trabajo: trabajoActualizado 
    });

  } catch (error: any) {
    console.error(`[Controller] Error al pagar trabajo ${id}: ${error.message}`);
    
    // --- ¡Error! --- 
    // Ahora buscamos todos los mensajes de error de "negocio" (400)
    const esErrorDeNegocio = 
      error.message.includes('No se puede continuar el pago por falta de saldo') || // ⬅️ Tu nuevo mensaje
      error.message.includes('no encontrado') ||
      error.message.includes('ya ha sido pagado') ||
      error.message.includes('debe estar "completado"');

    if (esErrorDeNegocio) {
      // Enviamos el mensaje de error específico del servicio (400 Bad Request)
      return res.status(400).json({ success: false, message: error.message });
    }
    
    // Si es cualquier otro error, es un 500
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};