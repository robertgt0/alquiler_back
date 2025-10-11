import { Router } from 'express';
import fixerController from '../controllers/fixer.controller';

const router = Router();

// === RUTAS DE FIXERS ===

// HU05: Registrar un nuevo Fixer
router.post('/', fixerController.createFixer);

// Obtener Fixer por userId
router.get('/user/:userId', fixerController.getFixerByUserId);

// HU01: Verificar si un CI ya existe
router.get('/ci/:ci', fixerController.checkCI);

// === RUTAS DE OFERTAS ===

// HU06: Crear una oferta
router.post('/ofertas', fixerController.createOferta);

// HU07: Editar una oferta
router.put('/ofertas/:id', fixerController.updateOferta);

// HU08: Eliminar una oferta
router.delete('/ofertas/:id', fixerController.deleteOferta);

// HU09: Obtener todas las ofertas (listado público)
router.get('/ofertas', fixerController.getAllOfertas);

// HU09: Obtener ofertas de un Fixer específico
router.get('/:fixerId/ofertas', fixerController.getOfertasByFixer);

// HU10: Obtener detalle de una oferta
router.get('/ofertas/:id', fixerController.getOfertaById);

export default router;