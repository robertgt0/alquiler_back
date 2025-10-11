import { Request, Response } from 'express';
import fixerService from '../services/fixer.service';
import { CreateFixerDTO, CreateOfertaDTO, UpdateOfertaDTO } from '../types';

class FixerController {
  // HU05: POST /api/fixers - Crear un nuevo Fixer
  async createFixer(req: Request, res: Response) {
    try {
      const data: CreateFixerDTO = req.body;

      const newFixer = await fixerService.createFixer(data);

      res.status(201).json({
        success: true,
        message: 'Fixer registrado con éxito',
        data: newFixer,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/fixers/user/:userId - Obtener Fixer por userId
  async getFixerByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const fixer = await fixerService.getFixerByUserId(userId);

      if (!fixer) {
        return res.status(404).json({
          success: false,
          message: 'Fixer no encontrado',
        });
      }

      res.status(200).json({
        success: true,
        data: fixer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/fixers/ci/:ci - Verificar si un CI ya existe
  async checkCI(req: Request, res: Response) {
    try {
      const { ci } = req.params;

      const fixer = await fixerService.getFixerByCI(ci);

      if (fixer) {
        return res.status(200).json({
          success: true,
          exists: true,
          message: 'Este C.I. ya se encuentra registrado',
        });
      }

      res.status(200).json({
        success: true,
        exists: false,
        message: 'C.I. disponible',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // HU06: POST /api/fixers/ofertas - Crear una oferta
  async createOferta(req: Request, res: Response) {
    try {
      const data: CreateOfertaDTO = req.body;

      const newOferta = await fixerService.createOferta(data);

      res.status(201).json({
        success: true,
        message: 'Oferta registrada con éxito',
        data: newOferta,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // HU07: PUT /api/fixers/ofertas/:id - Editar una oferta
  async updateOferta(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateOfertaDTO = req.body;

      const updatedOferta = await fixerService.updateOferta(id, data);

      res.status(200).json({
        success: true,
        message: 'Edición realizada con éxito',
        data: updatedOferta,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // HU08: DELETE /api/fixers/ofertas/:id - Eliminar una oferta
  async deleteOferta(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await fixerService.deleteOferta(id);

      res.status(200).json({
        success: true,
        message: 'Oferta eliminada con éxito',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // HU09: GET /api/fixers/:fixerId/ofertas - Obtener ofertas de un Fixer
  async getOfertasByFixer(req: Request, res: Response) {
    try {
      const { fixerId } = req.params;

      const ofertas = await fixerService.getOfertasByFixer(fixerId);

      res.status(200).json({
        success: true,
        data: ofertas,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // HU10: GET /api/fixers/ofertas/:id - Obtener detalle de una oferta
  async getOfertaById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const oferta = await fixerService.getOfertaById(id);

      res.status(200).json({
        success: true,
        data: oferta,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // HU09: GET /api/fixers/ofertas - Obtener todas las ofertas
  async getAllOfertas(req: Request, res: Response) {
    try {
      const ofertas = await fixerService.getAllOfertas();

      res.status(200).json({
        success: true,
        data: ofertas,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new FixerController();