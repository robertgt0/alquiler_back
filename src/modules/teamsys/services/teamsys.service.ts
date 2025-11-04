import Usuario, { UserDocument } from '../models/teamsys';
import { CrearUsuarioDto} from '../types/index';
import { validarPassword } from '../utils/validaciones';

export class UsuarioService {
  /**
   * Registrar un nuevo usuario en la base de datos
   */
  async registrarUsuario(data: CrearUsuarioDto ): Promise<UserDocument | null > {
    try {
      console.log('👤 Registrando nuevo usuario:', data.correo);
      
      // Validación de contraseña
      if (data.password != null) {
        if (!validarPassword(data.password)) {
          throw new Error('La contraseña no cumple con los requisitos mínimos');
        }
      }

      // Verificar si el correo ya está registrado
      console.log('🔍 Verificando si el correo existe:', data.correo);
      const existe = await Usuario.findOne({ correo: data.correo });
      if (existe) {
        console.log('❌ Correo ya registrado:', data.correo);
        throw new Error('El correo electrónico ya está registrado');
      }

      // Crear y guardar el nuevo usuario
      console.log('💾 Creando nuevo usuario en BD...');
      const nuevoUsuario = new Usuario(data);
      const resultado = await nuevoUsuario.save();
      
      console.log('✅ Usuario registrado exitosamente:', resultado.correo);
      return resultado;
    } catch (error) {
      console.error('❌ Error en registrarUsuario:');
      console.error('📝 Error:', error);
      throw error;
    }
  }

  /**
   * Verificar si un correo ya existe en la base de datos
   */
  async verificarCorreo(correo: string): Promise<boolean> {
    try {
      console.log('🔍 Verificando correo en BD:', correo);
      const usuario = await Usuario.findOne({ correo: correo });
      const existe = usuario !== null;
      console.log('📊 Resultado verificación:', existe ? 'EXISTE' : 'NO EXISTE');
      return existe;
    } catch (error) {
      console.error('❌ ERROR en verificarCorreo:');
      console.error('📝 Error:', error);
      throw error;
    }
  }

  /**
   * Autenticar usuario
   */
  async autenticarUsuario(correoE: string, password: string): Promise<UserDocument | null> {
    try {
      console.log('🔐 Autenticando usuario:', correoE);
      const usuario = await Usuario.findOne({ correo: correoE });
      
      if (!usuario) {
        console.log('❌ Usuario no encontrado');
        return null;
      }
      
      if (usuario.password !== password) {
        console.log('❌ Contraseña incorrecta');
        return null;
      }
      
      console.log('✅ Autenticación exitosa');
      return usuario;
    } catch (error) {
      console.error('❌ Error en autenticarUsuario:');
      console.error('📝 Error:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<UserDocument[]> {
    try {
      console.log('📋 Obteniendo todos los usuarios...');
      const usuarios = await Usuario.find();
      console.log('✅ Usuarios obtenidos:', usuarios.length);
      return usuarios;
    } catch (error) {
      console.error('❌ Error en getAll:');
      console.error('📝 Error:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async getById(id: string): Promise<UserDocument | null> {
    try {
      console.log('🔍 Buscando usuario por ID:', id);
      const usuario = await Usuario.findById(id);
      console.log('📊 Resultado:', usuario ? 'ENCONTRADO' : 'NO ENCONTRADO');
      return usuario;
    } catch (error) {
      console.error('❌ Error en getById:');
      console.error('📝 Error:', error);
      throw error;
    }
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
    try {
      console.log('✏️ Actualizando usuario:', id);
      const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });
      console.log('✅ Usuario actualizado:', usuario ? 'EXITOSO' : 'NO ENCONTRADO');
      return usuario;
    } catch (error) {
      console.error('❌ Error en update:');
      console.error('📝 Error:', error);
      throw error;
    }
  }

  /**
   * Eliminar un usuario por ID
   */
  async delete(id: string): Promise<UserDocument | null> {
    try {
      console.log('🗑️ Eliminando usuario:', id);
      const usuario = await Usuario.findByIdAndDelete(id);
      console.log('✅ Usuario eliminado:', usuario ? 'EXITOSO' : 'NO ENCONTRADO');
      return usuario;
    } catch (error) {
      console.error('❌ Error en delete:');
      console.error('📝 Error:', error);
      throw error;
    }
  }
}

export default new UsuarioService();