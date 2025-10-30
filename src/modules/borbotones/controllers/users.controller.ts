import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';
import { ObjectId } from 'mongodb';

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener la conexión a la base de datos' 
      });
    }

    const usuariosCollection = db.collection('usuarios');
    let query: any = {};

    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else if (!isNaN(Number(id))) {
      query = { id_usuario: Number(id) };
    } else {
      query = { $or: [{ _id: id }, { email: id }, { nombre: { $regex: id, $options: 'i' } }] };
    }

    // No forzamos transformaciones de codificación aquí — asumimos que el cliente envía UTF-8.
    // Solo normalizamos estructura si es necesario.
    if (updates.servicios) {
      updates.servicios = updates.servicios.map((servicio: any) => ({
        ...servicio,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion
      }));
    }

    const result = await usuariosCollection.updateOne(query, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Obtener el usuario actualizado y asegurar codificación UTF-8
    const updatedUser = await usuariosCollection.findOne(query);

    return res.json({ 
      success: true, 
      message: 'Usuario actualizado correctamente',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};