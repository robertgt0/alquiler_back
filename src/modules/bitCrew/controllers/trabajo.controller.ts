import { Request, Response } from 'express';
import * as fixerService from '../services/Fixer.service';
import * as trabajoService from '../services/trabajo.service';

/**
 * Maneja la petición de obtener los trabajos de un fixer por su 'usuario'.
 */
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