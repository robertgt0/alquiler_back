import { Request, Response } from 'express';
import * as fixerService from '../services/Fixer.service';
import * as billeteraService from '../services/wallet.service';

export const handleGetBilleteraByUsuario = async (req: Request, res: Response) => {
  const { usuario } = req.params;
  console.log(`[Controller] Petición GET para /billetera/${usuario}`);

  try {
    // 1. Encontrar al fixer
    const fixer = await fixerService.getFixerByUsuario(usuario);

    if (!fixer) {
      console.log(`[Controller] Fixer '${usuario}' no encontrado.`);
      return res.status(404).json({ success: false, message: `Fixer con usuario '${usuario}' no encontrado.` });
    }
    
    console.log(`[Controller] Fixer encontrado: ${fixer.nombre}`);

    // 2. Encontrar la billetera
    let billetera = await billeteraService.getBilleteraByFixerId(fixer._id);
    
    if (!billetera) {
      console.log(`[Controller] Billetera no encontrada para ${usuario}.`);
      return res.status(404).json({ 
        success: false, 
        message: `Billetera no encontrada para ${usuario}`,
        fixer: { nombre: fixer.nombre, usuario: fixer.usuario }
      });
    }
    try {
      // Actualizamos la variable 'billetera' con el resultado de la función
      const billeteraActualizada = await billeteraService.checkAndUpdateBilleteraStatus(billetera._id);
      console.log(`[Controller] Chequeo de estado de billetera completado.`);
      
      // 5. Devolver la respuesta con la billetera actualizada
      return res.status(200).json({
        success: true,
        message: `Datos de billetera encontrados para ${usuario}`,
        billetera: billeteraActualizada // <-- Devolvemos la billetera con el estado ya actualizado
      });

    } catch (checkError: any) {
      console.error(`[Controller] Error durante el chequeo de estado de billetera: ${checkError.message}`);
      // Si el chequeo falla, devolvemos la billetera tal como la encontramos
      return res.status(500).json({ success: false, message: 'Error al actualizar estado de billetera', billetera: billetera });
    }
    // ================================================================

  } catch (error: any) {
    console.error(`[Controller] Error fatal en handleGetBilleteraByUsuario: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
//hola
