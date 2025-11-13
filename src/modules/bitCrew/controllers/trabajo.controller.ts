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

/**
 * ✅ SOLUCIÓN BUG 2: Mejorado para devolver mensajes específicos de error
 */
export const handlePagarTrabajoEfectivo = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del *trabajo*

  try {
    const trabajoActualizado = await trabajoService.pagarTrabajoEfectivo(id);
    
    res.status(200).json({ 
      success: true, 
      message: 'El sistema descontará la comisión (5%) de su billetera y marcará el trabajo como pagado.',
      trabajo: trabajoActualizado 
    });

  } catch (error: any) {
    console.error(`[Controller] Error al pagar trabajo ${id}: ${error.message}`);
    
    // ✅ SOLUCIÓN: Detectar el error de saldo insuficiente específicamente
    if (error.message.includes('Saldo insuficiente')) {
      return res.status(400).json({ 
        success: false, 
        message: error.message, // Mensaje completo: "Saldo insuficiente (Bs. X) para pagar la comisión (Bs. Y)."
        errorCode: 'SALDO_INSUFICIENTE' // Código específico para el frontend
      });
    }
    
    // Otros errores de validación del negocio
    if (error.message.includes('no encontrado') ||
        error.message.includes('ya ha sido pagado') ||
        error.message.includes('debe estar "completado"')) {
      return res.status(400).json({ 
        success: false, 
        message: error.message,
        errorCode: 'VALIDATION_ERROR'
      });
    }
    
    // Error genérico del servidor (cuando no sabemos qué pasó)
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      errorCode: 'SERVER_ERROR'
    });
  }
};