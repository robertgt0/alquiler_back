/*
import { Request, Response } from 'express';
import * as fixerService from '../services/Fixer.service';
import * as billeteraService from '../services/wallet.service';

// --- FUNCIÓN DINÁMICA (LA QUE YA TENÍAS) ---
// Sigue funcionando en /billetera/:usuario
export const handleGetBilleteraByUsuario = async (req: Request, res: Response) => {
  // ... (el código de la función anterior se mantiene igual)
  // ... (los logs que añadimos siguen aquí)
  console.log(`[Controller] Petición recibida para usuario: ${req.params.usuario}`);
  
  try {
    const { usuario } = req.params;
    const fixer = await fixerService.getFixerByUsuario(usuario);

    if (!fixer) {
      console.log(`[Controller] Fixer no encontrado para usuario: ${usuario}`);
      return res.status(404).json({ message: `Fixer con usuario '${usuario}' no encontrado.` });
    }

    console.log(`[Controller] Fixer encontrado: ${fixer.nombre} (ID: ${fixer._id})`);
    const billetera = await billeteraService.getBilleteraByFixerId(fixer._id);

    if (!billetera) {
      console.log(`[Controller] Billetera no encontrada para Fixer ID: ${fixer._id}`);
      return res.status(404).json({ 
        message: `Billetera no encontrada para el fixer '${usuario}'.`,
        fixer_id: fixer._id
      });
    }

    console.log(`[Controller] ¡Éxito! Enviando billetera:`, billetera);
    res.status(200).json(billetera);

  } catch (error: any) {
    console.error('[Controller] Error interno:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


// --- 🚀 NUEVA FUNCIÓN "HARCODED" PARA PRUEBAS ---
// Esta función SIEMPRE buscará a "tmolina"
export const handleGetBilleteraTmolina = async (req: Request, res: Response) => {
  
  const usuario_fijo = "tmolina"; // <-- ¡Aquí está!
  
  console.log(`[Controller] Petición de prueba recibida para: ${usuario_fijo}`);

  try {
    const fixer = await fixerService.getFixerByUsuario(usuario_fijo);

    if (!fixer) {
      console.log(`[Controller] (Prueba) Fixer no encontrado: ${usuario_fijo}`);
      return res.status(404).json({ message: `Fixer con usuario '${usuario_fijo}' no encontrado.` });
    }

    console.log(`[Controller] (Prueba) Fixer encontrado: ${fixer.nombre} (ID: ${fixer._id})`);
    
    const billetera = await billeteraService.getBilleteraByFixerId(fixer._id);

    if (!billetera) {
      console.log(`[Controller] (Prueba) Billetera no encontrada para Fixer ID: ${fixer._id}`);
      return res.status(404).json({ 
        message: `Billetera no encontrada para el fixer '${usuario_fijo}'.`,
        fixer_id: fixer._id
      });
    }

    console.log(`[Controller] (Prueba) ¡Éxito! Enviando billetera:`, billetera);
    res.status(200).json(billetera);

  } catch (error: any) {
    console.error('[Controller] (Prueba) Error interno:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};*/
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

    // ================================================================
    // 🚀 3. LLAMAR A LA NUEVA FUNCIÓN DE CHEQUEO
    // ================================================================
    // Cada vez que se pida la billetera, se chequeará y actualizará SU PROPIO estado.
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