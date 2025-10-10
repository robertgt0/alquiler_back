import { Router, Request, Response } from 'express';
import User from '../../../models/user.model';
import bcrypt from 'bcryptjs';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, lastName, ci, email, phone, password, role } = req.body;

    // Validaciones básicas
    if (!name || !lastName || !ci || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'El usuario ya existe' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      lastName,
      ci,
      email,
      phone,
      password: hashedPassword,
      role: role || 'cliente',
    });

    await newUser.save();

    // Retornar datos sin la contraseña
    const userResponse = newUser.toJSON();

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;
