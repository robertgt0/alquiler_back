import Usuario from '../models/teamsys';
import { TeamsysEntity } from '../types';

export class UsuarioService {
  /**
   * Registrar un nuevo usuario
   */
  async registrarUsuario(data: any) {
    const nuevoUsuario = new Usuario(data);
    return await nuevoUsuario.save();
  }

  /**
   * Verificar si un correo ya existe
   */
  async verificarCorreo(correo: string) {
    const usuario = await Usuario.findOne({ correoElectronico: correo });
    return !!usuario;
  }
}

export default new UsuarioService();
