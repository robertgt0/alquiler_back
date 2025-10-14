import Usuario from '../models/teamsys';
import { CrearUsuarioDto, UsuarioDocument } from '../types/index';
import { validarPassword } from '../utils/validaciones';

export class UsuarioService {
  /**
   * Registrar un nuevo usuario en la base de datos
   * @param data - Datos básicos del usuario (DTO)
   * @returns Usuario creado
   */
  async registrarUsuario(data: CrearUsuarioDto): Promise<UsuarioDocument> {
    // Validación de contraseña
    if (!validarPassword(data.password)) {
      throw new Error('La contraseña no cumple con los requisitos mínimos');
    }

    // Verificar si el correo ya está registrado
    const existe = await Usuario.findOne({ correoElectronico: data.correoElectronico });
    if (existe) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crear y guardar el nuevo usuario
    const nuevoUsuario = new Usuario(data);
    return await nuevoUsuario.save();
  }

  /**
   * Verificar si un correo ya existe en la base de datos
   * @param correo - Correo electrónico a verificar
   * @returns true si existe, false si no
   */
  async verificarCorreo(correo: string): Promise<boolean> {
    const usuario = await Usuario.findOne({ correoElectronico: correo });
    return !!usuario;
  }

  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<UsuarioDocument[]> {
    return await Usuario.find();
  }

  /**
   * Obtener un usuario por ID
   */
  async getById(id: string): Promise<UsuarioDocument | null> {
    return await Usuario.findById(id);
  }

  /**
   * Crear un nuevo usuario (usado por el controlador)
   */
  async create(data: CrearUsuarioDto): Promise<UsuarioDocument> {
    return await this.registrarUsuario(data);
  }

  /**
   * Actualizar un usuario existente
   */
  async update(id: string, data: Partial<CrearUsuarioDto>): Promise<UsuarioDocument | null> {
    return await Usuario.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Eliminar un usuario por ID
   */
  async delete(id: string): Promise<UsuarioDocument | null> {
    return await Usuario.findByIdAndDelete(id);
  }


}

export default new UsuarioService();