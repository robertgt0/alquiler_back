// src/modules/DevCode/controllers/oferta.controller.ts
import { Request, Response } from 'express';
import { OfertaService } from '../services/oferta.service';

export class OfertaController {
  /**
   * GET /api/devcode/ofertas/nuevas/:clienteId
   * Verifica nuevas ofertas para un cliente
   */
  static async verificarNuevasOfertas(req: Request, res: Response) {
    try {
      const { clienteId } = req.params;
      const minutosAtras = parseInt(req.query.minutos as string) || 15;

      const resultado = await OfertaService.detectarNuevasOfertas(clienteId, minutosAtras);

      res.json({
        success: true,
        nuevas: resultado.nuevas,
        servicios: resultado.servicios,
        timestamp: new Date(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/devcode/ofertas/marcar-vistas
   * Marca ofertas como vistas
   */
  static async marcarComoVistas(req: Request, res: Response) {
    try {
      const { clienteId, serviciosIds } = req.body;

      if (!clienteId || !Array.isArray(serviciosIds)) {
        return res.status(400).json({
          success: false,
          message: 'clienteId y serviciosIds (array) son requeridos',
        });
      }

      const resultado = await OfertaService.marcarOfertasComoVistas(clienteId, serviciosIds);

      res.json({
        success: true,
        marcadas: resultado.marcadas,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}