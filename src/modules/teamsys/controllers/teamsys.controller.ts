import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse} from '../types/index';
import Usuario, { UserDocument } from '../models/teamsys';
import { handleError } from '../errors/errorHandler';
import { authController } from './auth.controller';

/* Endpoint de debug para Google Auth */
export const debugGoogleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🧪 ========= DEBUG ENDPOINT CALLED =========');
    console.log('📝 Request body:', req.body);
    console.log('🔑 Environment variables check:');
    console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ SET' : '❌ MISSING');
    console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ SET' : '❌ MISSING');
    console.log('   GOOGLE_REDIRECT_URL:', process.env.GOOGLE_REDIRECT_URL);
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');
    
    res.json({
      success: true,
      message: 'Debug endpoint working',
      env: {
        clientId: !!process.env.GOOGLE_CLIENT_ID,
        clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl: process.env.GOOGLE_REDIRECT_URL,
        jwtSecret: !!process.env.JWT_SECRET
      },
      receivedBody: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/* Endpoint de test simple */
export const testGoogleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🧪 ========= TEST ENDPOINT CALLED =========');
    const { code } = req.body;
    
    console.log('📥 Test - Código recibido:', code ? `${code.substring(0, 30)}...` : 'NO CODE');
    
    // Simular una respuesta exitosa para testing
    res.json({
      success: true,
      message: 'Test endpoint working - Code received successfully',
      receivedCode: code ? 'VALID' : 'MISSING',
      codeLength: code ? code.length : 0,
      testData: {
        user: {
          nombre: 'Test User',
          correo: 'test@example.com',
          fotoPerfil: 'https://example.com/photo.jpg',
          terminosYCondiciones: true
        },
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token'
      }
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/* Endpoint de callback de Google */
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Iniciando callback de Google desde controller...');
    await authController.googleCallback(req, res);
  } catch (error) {
    console.error('❌ Error en googleCallback controller:', error);
    handleError(error, res);
  }
};

/*obtener todos los registros de usuario */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.getAll();
    const response: ApiResponse<UserDocument[]> = {
      success: true,
      count: data.length,
      data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const existsByEmail = async (req: Request, res: Response) => {
  try {
    const email = (req.query.email ?? '').toString().trim();

    if (!email) {
      return res.status(400).json({ error: 'El parámetro "email" es requerido' });
    }

    const exists = await teamsysService.verificarCorreo(email);

    return res.json({ exists });
  } catch (err) {
    console.error('Error en existsByEmail:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/*obtener usr por id */
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.getById(req.params.id);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    const response: ApiResponse<UserDocument> = {
      success: true,
      data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*crear nuevo usr */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.create(req.body);
    const response: ApiResponse<UserDocument | null> = {
      success: true,
      data,
      message: 'Registro creado exitosamente'
    };
    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*actualizar un usr existente */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.update(req.params.id, req.body);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    const response: ApiResponse<UserDocument> = {
      success: true,
      data,
      message: 'Registro actualizado exitosamente'
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*eliminaar un usr por id */
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.delete(req.params.id);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    res.json({
      success: true,
      message: 'Registro eliminado correctamente',
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Registrar un nuevo usuario (versión autenticación)
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const nuevoUsuario = await teamsysService.create(data);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: nuevoUsuario,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Iniciar sesión de un usuario existente
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correoElectronico, password } = req.body;

    if (!correoElectronico || !password) {
      res.status(400).json({
        success: false,
        message: 'El correo electrónico y la contraseña son requeridos',
      });
      return;
    }

    const usuario = await teamsysService.autenticarUsuario(correoElectronico, password);

    if (!usuario) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: usuario,
    });
  } catch (error) {
    handleError(error, res);
  }
};