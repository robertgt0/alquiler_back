import Usuario, { UserDocument } from '../models/teamsys';
import { CrearUsuarioDto} from '../types/index';
import { validarPassword } from '../utils/validaciones';

export class UsuarioService {
  /**
   * Registrar un nuevo usuario en la base de datos
   * @param data - Datos básicos del usuario (DTO)
   * @returns Usuario creado
   */
  async registrarUsuario(data: CrearUsuarioDto ): Promise<UserDocument | null > {
    // Validación de contraseña
    if (data.password!=null) {
    if (!validarPassword(data.password)) {
      throw new Error('La contraseña no cumple con los requisitos mínimos');
    }
    }

    // Verificar si el correo ya está registrado
    const existe = await Usuario.findOne({ correo: data.correo });
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
    const usuario = await Usuario.findOne({ correo: correo });
    return usuario!=null;
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
  async update(id: string, data: Partial<CrearUsuarioDto>): Promise<UserDocument | null> {
    return await Usuario.findByIdAndUpdate(id, data, { new: true });
  }

  async updateTwoFactorSecret(userId: string, secret: string, enabled: boolean): Promise<UserDocument> {
    const user = await this.getById(userId);

    if (!user) {
      throw new Error("User Not Found");
    }

    await Usuario.findByIdAndUpdate(user.id, {
      twoFactorSecret: secret,
      twoFactorEnabled: enabled
    });

    return user;
  }

  async disableTwoFactor(userId: string): Promise<UserDocument> {
    const user = await this.getById(userId);

    if (!user) {
      throw new Error("User Not Found");
    }

    await Usuario.findByIdAndUpdate(user.id, {
      twoFactorSecret: undefined,
      twoFactorEnabled: false
    });

    return user;
  }

  /**
   * Eliminar un usuario por ID
   */
  async delete(id: string): Promise<UserDocument | null> {
    return await Usuario.findByIdAndDelete(id);
  }


}

export default new UsuarioService();