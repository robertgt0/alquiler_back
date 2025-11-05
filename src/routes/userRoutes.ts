import express from 'express';
import teamsysRoutes from '../modules/teamsys/routes/teamsys.routes';

const router = express.Router();
router.use('/teamsys', teamsysRoutes); // ruta de crear usr /api/teamsys


/*
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
 

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
*/
export default router;
