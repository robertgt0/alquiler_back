import jwt from 'jsonwebtoken';

export const verifyFixer = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;  // Guarda los datos del usuario en la petición
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token no válido' });
  }
};
