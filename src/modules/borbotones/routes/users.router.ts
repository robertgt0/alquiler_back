import { Router } from 'express';
import { updateUser } from '../controllers/users.controller';

const router = Router();

router.put('/users/:id', updateUser);

export default router;