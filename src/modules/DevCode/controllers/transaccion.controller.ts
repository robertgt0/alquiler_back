import { Request, Response } from 'express';
import * as fixerService from '../services/fixer.service';
import * as transaccionService from '../services/transaccion.service';

/**
 
Maneja la petición GET /historial/:usuario*/
export const handleGetTransaccionesByUsuario = async (req: Request, res: Response) => {
  const { usuario } = req.params;
  console.log(`[Controller] Petición GET para /historial/${usuario}`);

  try {
    // 1. Encontrar al fixer por su nombre de usuario
    const fixer = await fixerService.getFixerByUsuario(usuario);

    if (!fixer) {
      console.log(`[Controller] (Historial) Fixer '${usuario}' no encontrado.`);
      return res.status(404).json({ success: false, message: `Fixer con usuario '${usuario}' no encontrado.` });
    }

    // 2. Usar el _id del fixer para buscar su historial de transacciones
    const transacciones = await transaccionService.getTransaccionesByFixerId(fixer._id);

    // 3. Devolver las transacciones (puede ser un array vacío, no es un error)
    console.log(`[Controller] (Historial) Encontradas ${transacciones.length} transacciones para ${usuario}.`);
    res.status(200).json({
      success: true,
      transacciones: transacciones
    });

  } catch (error: any) {
    console.error(`[Controller] Error fatal en handleGetTransaccionesByUsuario: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};