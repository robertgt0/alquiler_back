import { UsuarioDocument } from '@/models/User';
import Usuario, { UserDocument,UserAuth,UserAuthModel,UserAuthDocument} from '../models/teamsys';
import { CrearUsuarioDto } from '../types/index';
import { validarPassword } from '../utils/validaciones';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

export class UsuarioService {
  /**
   * Registrar un nuevo usuario en la base de datos
   * @param data - Datos básicos del usuario (DTO)
   * @returns Usuario creado
   */
  async registrarUsuario(data: CrearUsuarioDto ): Promise<UserDocument | null > {
    // Verificar si el correo ya está registrado
    const existe = await Usuario.findOne({ correo: data.correo });
    if (existe) {
      throw new Error('El correo electrónico ya está registrado');
    }
    if (data.password!=null) {
    if (!validarPassword(data.password)) {
      throw new Error('La contraseña no cumple con los requisitos mínimos');
    }
    }
    const userData = {
      ...data,
      authProvider: data.password ? 'local' : 'google'
    };
    // Crear y guardar el nuevo usuario
    const nuevoUsuario = new Usuario(userData);
    const usuarioCreado=await nuevoUsuario.save();
    try {

    await UserAuthModel.create({
      userId: usuarioCreado._id,
      authProvider: [usuarioCreado.authProvider],
      // mapaModificacion usa el default=3 del schema
    });
  } catch (err) {
    // Rollback manual para no dejar usuario sin su user_auth
    await Usuario.findByIdAndDelete(usuarioCreado._id).catch(() => {});
    throw new Error('No se pudo crear el user_auth para el nuevo usuario');
  }
    return usuarioCreado;
  }
  /**
   * Verificar si un correo ya existe en la base de datos
   * @param correo - Correo electrónico a verificar
   * @returns true si existe, false si no
   */
  async verificarCorreo(correo: string): Promise<UserDocument | null> {
    const usuario = await Usuario.findOne({ correo: correo });
    return usuario;
  }

  /**
   * Impedir que el usuario acceda al sistema si la contraseña es incorrecta.
 * Verifica que el correo y la contraseña coincidan con un usuario registrado
 * @param correo - Correo electrónico del usuario que intenta iniciar sesión
 * @param password - Contraseña a verificiar, comparar e impedir si no es el caso
 * @returns User si las contraseñas coinciden, null si no
 */
  async autenticarUsuario(correoE: string, password: string): Promise<UserDocument | null> {
    const usuario = await Usuario.findOne({ correo: correoE });
    if (!usuario) return null;
    if (usuario.password !== password) return null;
    return usuario;
  }


  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<UserDocument[]> {
    return await Usuario.find();
  }

  /**
   * Obtener un usuario por ID
   */
  async getById(id: string): Promise<UserDocument | null> {
    return await Usuario.findById(id);
  }

  /**
   * Crear un nuevo usuario (usado por el controlador)
   */
  async create(data: CrearUsuarioDto): Promise<UserDocument | null> {
    return await this.registrarUsuario(data);
  }

  /**
   * Actualizar un usuario existente
   */
  async update(id: string, data: Partial<CrearUsuarioDto | UserDocument>): Promise<UserDocument | null> {
    return await Usuario.findByIdAndUpdate(id, data);
  }

  /**
   * Eliminar un usuario por ID
   */
  async delete(id: string): Promise<UserDocument | null> {
    return await Usuario.findByIdAndDelete(id);
  }

  async getUserAuthByUserId(userId: string | Types.ObjectId): Promise<UserAuthDocument | null> {
    // Convertimos a ObjectId si llega como string
    const objectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const userAuth = await UserAuthModel.findOne({ userId: objectId });
    return userAuth;
  }
  /**
   * Actualiza el campo authProvider en la colección user_auth
   * @param userId - ID del usuario
   * @param newProviders - Nuevo array de métodos de autenticación
   * @returns Documento actualizado o null
   */
  async updateUserAuthProviders(
    userId: string | Types.ObjectId,
    newProviders: string[]
  ): Promise<UserAuth | null> {
    const objectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const updatedUserAuth = await UserAuthModel.findOneAndUpdate(
      { userId: objectId },
      { authProvider: newProviders },
      { new: true }
    );

    return updatedUserAuth;
  }

  async updateUbicacionUser(userId:string,ubicacion: {
    type: 'Point';
    coordinates: number[]; // [lng, lat]
  } ):Promise<UserDocument | null>{
    const objectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    return await Usuario.findOneAndUpdate({_id:objectId},{ubicacion:ubicacion },{new:true})
  }

  async updateTelefonoUser(userId:string,telefono:string ):Promise<UserDocument | null>{
    const objectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    return await Usuario.findOneAndUpdate({_id:objectId},{telefono:telefono },{new:true})
  }

  async decrementMapaModificacion(
  userId: string | Types.ObjectId
): Promise<UserAuth | null> {
  const objectId =
    typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  // 🔽 Resta 1 al campo mapaModificacion
  const updatedUserAuth = await UserAuthModel.findOneAndUpdate(
    { userId: objectId },
    { $inc: { mapaModificacion: -1 } },
    { new: true }
  );

  return updatedUserAuth;
}
async cambiarContraseña(
  userId: string, 
  contraseñaActual: string, 
  nuevaContraseña: string
): Promise<UserDocument> {
  // Convertir el string userId a ObjectId
  let usuario;
  
  try {
    // Si userId es un ObjectId válido, convertirlo
    if (mongoose.Types.ObjectId.isValid(userId)) {
      usuario = await Usuario.findById(new mongoose.Types.ObjectId(userId));
    } else {
      // Si no es ObjectId válido, buscar por otros campos
      usuario = await Usuario.findOne({ correo: userId });
    }
  } catch (error) {
    throw new Error('ID de usuario inválido');
  }

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar contraseña actual (solo para usuarios locales)
  if (usuario.authProvider === 'local' && usuario.password) {
    if (usuario.password !== contraseñaActual) {
      throw new Error('La contraseña actual es incorrecta');
    }
  }

  // Validar nueva contraseña
  if (!validarPassword(nuevaContraseña)) {
    throw new Error('La nueva contraseña no cumple con los requisitos de seguridad');
  }

  // Actualizar contraseña
  usuario.password = nuevaContraseña;
  return await usuario.save();
}


/**
 * Obtener usuario por email
 */
async getUserByEmail(email: string): Promise<UserDocument | null> {
  return await Usuario.findOne({ correo: email });
}
}

export default new UsuarioService();