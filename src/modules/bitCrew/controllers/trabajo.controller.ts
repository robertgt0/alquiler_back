/*
import { Request, Response } from 'express';
import * as fixerService from '../services/Fixer.service';
import * as trabajoService from '../services/trabajo.service';


export const handleGetTrabajosByUsuario = async (req: Request, res: Response) => {
  const { usuario } = req.params;
  
  try {
    // 1. Encontrar al Fixer por su 'usuario'
    const fixer = await fixerService.getFixerByUsuario(usuario);

    if (!fixer) {
      return res.status(404).json({ success: false, message: `Fixer con usuario '${usuario}' no encontrado.` });
    }

    // 2. Usar el _id del fixer para buscar sus trabajos
    const trabajos = await trabajoService.getTrabajosByFixerId(fixer._id);

    // 3. Devolver los trabajos encontrados
    res.status(200).json(trabajos); // Puede ser un array vacío, no es un error

  } catch (error: any) {
    console.error(`Error al obtener trabajos para ${usuario}:`, error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
*/
import { Request, Response } from 'express';
import * as fixerService from '../services/Fixer.service';
import * as trabajoService from '../services/trabajo.service';

/**
 * Obtiene trabajos por nombre de usuario del fixer
 */
export const handleGetTrabajosByUsuario = async (req: Request, res: Response) => {
  const { usuario } = req.params;
  
  try {
    const fixer = await fixerService.getFixerByUsuario(usuario);

    if (!fixer) {
      return res.status(404).json({ success: false, message: `Fixer con usuario '${usuario}' no encontrado.` });
    }

    const trabajos = await trabajoService.getTrabajosByFixerId(fixer._id);

    res.status(200).json(trabajos);

  } catch (error: any) {
    console.error(`Error al obtener trabajos para ${usuario}:`, error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// ================================================================
// 🚀 NUEVO MANEJADOR: Para pagar un trabajo en efectivo
// ================================================================
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
    
    // Enviar errores específicos al frontend
    if (error.message === 'Saldo insuficiente' || 
        error.message.includes('no encontrado') ||
        error.message.includes('ya ha sido pagado')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};