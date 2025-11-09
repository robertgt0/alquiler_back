import { Router } from 'express';
import * as fixerController from '../controllers/fixer.controller';

const router = Router();

// Esta ruta se montará en /api/bitcrew/fixers
router.get('/', fixerController.handleGetAllFixers);

export default router;