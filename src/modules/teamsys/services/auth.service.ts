import axios from "axios";
import * as jwt from 'jsonwebtoken';
import { UsuarioDocument, CrearUsuarioDto } from "../types";
import { AuthTokens, GoogleTokenResponse, GoogleUserProfile, JWTPayload } from "../types/auth.types";
import { TokenResponse } from "../types/token.types";
import teamsysService from '../services/teamsys.service';

type Secret = jwt.Secret;
type SignOptions = jwt.SignOptions;
type JwtPayload = jwt.JwtPayload;
type AppJWTPayload = JwtPayload & { userId: string; email: string };

export class AuthService  {
    
    private readonly googleTokenUrl = "https://oauth2.googleapis.com/token";
    private readonly googleUserInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
    private readonly jwtSecret: Secret;
    private readonly jwtRefreshSecret: Secret;
    private readonly accessTokenExpiry: string;
    private readonly refreshTokenExpiry: string;

    constructor() {
        console.log('🔄 Inicializando AuthService...');
        
        const s = process.env.JWT_SECRET ?? "servineoapptest123";
        const rs = process.env.JWT_REFRESH_SECRET ?? "servineoapptest123";
        
        console.log('🔐 JWT_SECRET configurado:', !!s);
        console.log('🔐 JWT_REFRESH_SECRET configurado:', !!rs);
        
        if (!s || !rs) throw new Error("JWT secrets no estan configurados");

        this.jwtSecret = s as Secret;
        this.jwtRefreshSecret = rs as Secret;
        this.accessTokenExpiry = process.env.JWT_EXPIRES_IN ?? "1h";
        this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

        console.log('✅ AuthService inicializado correctamente');
    }

    async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
        try {
            console.log('🔐 STEP 1: Intercambiando código por tokens...');
            console.log('📤 Google Token URL:', this.googleTokenUrl);
            console.log('🔑 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ CONFIGURADO' : '❌ NO CONFIGURADO');
            console.log('🔐 GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ CONFIGURADO' : '❌ NO CONFIGURADO');
            console.log('🔄 GOOGLE_REDIRECT_URL:', process.env.GOOGLE_REDIRECT_URL);
            console.log('📝 Código recibido (longitud):', code.length, 'caracteres');

            if (!process.env.GOOGLE_CLIENT_ID) {
                throw new Error('GOOGLE_CLIENT_ID no está configurado en las variables de entorno');
            }
            if (!process.env.GOOGLE_CLIENT_SECRET) {
                throw new Error('GOOGLE_CLIENT_SECRET no está configurado en las variables de entorno');
            }
            if (!process.env.GOOGLE_REDIRECT_URL) {
                throw new Error('GOOGLE_REDIRECT_URL no está configurado en las variables de entorno');
            }

            const body = new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URL,
                grant_type: 'authorization_code',
            });

            console.log('📦 Enviando request a Google OAuth...');
            const response = await axios.post<GoogleTokenResponse>(
                this.googleTokenUrl,
                body,
                { 
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    timeout: 15000
                }
            );

            console.log('✅ STEP 1 COMPLETADO: Tokens recibidos exitosamente de Google');
            console.log('📊 Response status:', response.status);
            return response.data;

        } catch (error: any) {
            console.error('❌ ERROR en exchangeCodeForTokens:');
            
            if (error.response) {
                console.error('📊 Google Response Data:', error.response.data);
                console.error('🔢 Google Response Status:', error.response.status);
                console.error('📋 Google Response Headers:', error.response.headers);
                
                if (error.response.data.error === 'invalid_grant') {
                    throw new Error('Código de autorización inválido o expirado. Detalles: ' + error.response.data.error_description);
                }
                
                throw new Error(`Error de Google OAuth: ${error.response.data.error} - ${error.response.data.error_description}`);
            } else if (error.request) {
                console.error('❌ No se recibió respuesta de Google - Timeout o problema de red');
                throw new Error('No se pudo conectar con el servidor de Google. Verifica tu conexión a internet.');
            } else {
                console.error('❌ Error configurando el request:', error.message);
                throw new Error(`Error de configuración: ${error.message}`);
            }
        }
    }

    async getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
        try {
            console.log('👤 STEP 2: Obteniendo perfil de usuario de Google...');
            console.log('🔑 Access Token (primeros 20 chars):', accessToken.substring(0, 20) + '...');
            
            const headers = { Authorization: `Bearer ${accessToken}` };

            const response = await axios.get<GoogleUserProfile>(this.googleUserInfoUrl, { 
                headers,
                timeout: 10000
            });

            console.log('✅ STEP 2 COMPLETADO: Perfil obtenido exitosamente');
            console.log('📧 Email del usuario:', response.data.email);
            console.log('👤 Nombre del usuario:', response.data.name);
            return response.data;

        } catch (error: any) {
            console.error('❌ ERROR obteniendo perfil de Google:');
            if (error.response) {
                console.error('📊 Response Data:', error.response.data);
                console.error('🔢 Status:', error.response.status);
            } else if (error.request) {
                console.error('❌ No response received');
            } else {
                console.error('❌ Error:', error.message);
            }
            throw new Error(`Failed to fetch user profile from Google: ${error.message}`);
        }
    }

    async findOrCreateUser(profile: GoogleUserProfile, authType: 'register' | 'login' = 'register'): Promise<CrearUsuarioDto | null> {
        try {
            console.log('🔍 STEP 3: Buscando usuario en la base de datos...');
            console.log('📧 Email a buscar:', profile.email);
            console.log('🔐 Tipo de autenticación:', authType);
            
            const userExists = await teamsysService.verificarCorreo(profile.email);
            console.log('📊 Usuario existe en BD:', userExists);

            if (!userExists) {
                // Usuario NO existe - crear nuevo solo si es REGISTRO
                if (authType === 'register') {
                    console.log('👤 Creando nuevo usuario (registro)...');
                    const nuevoUsuario: CrearUsuarioDto = {
                        nombre: profile.name || '',
                        correo: profile.email || '',
                        fotoPerfil: profile.picture,
                        terminosYCondiciones: true,
                    };
                    console.log('✅ Nuevo usuario creado en memoria:', nuevoUsuario);
                    return nuevoUsuario;
                } else {
                    // Si es LOGIN y el usuario NO existe, esto es un error
                    console.log('❌ Usuario no existe durante login');
                    return null;
                }
            } else {
                // Usuario EXISTE
                if (authType === 'login') {
                    // Durante LOGIN: usuario existe → retornar datos del usuario para login
                    console.log('✅ Usuario existe durante login - procediendo con autenticación');
                    const usuarioExistente: CrearUsuarioDto = {
                        nombre: profile.name || '',
                        correo: profile.email || '',
                        fotoPerfil: profile.picture,
                        terminosYCondiciones: true,
                    };
                    return usuarioExistente;
                } else {
                    // Durante REGISTRO: usuario existe → retornar null (indicar que ya está registrado)
                    console.log('ℹ️ Usuario ya existe durante registro - no se puede crear duplicado');
                    return null;
                }
            }

        } catch (error) {
            console.error('❌ ERROR en findOrCreateUser:');
            console.error('Error details:', error);
            throw error;
        }
    }

    private signToken(payload: AppJWTPayload, secret: Secret, expiresIn: string): string {
        const opts = { expiresIn } as SignOptions;
        return jwt.sign(payload, secret, opts);
    }

    generateAccessToken(payload: JWTPayload): string {
        return this.signToken(payload, this.jwtSecret, this.accessTokenExpiry);
    }

    generateRefreshToken(payload: AppJWTPayload): string {
        return this.signToken(payload, this.jwtRefreshSecret, this.refreshTokenExpiry);
    }

    generateTokens(user: UsuarioDocument): AuthTokens {
        try {
            console.log('🔨 STEP 4: Generando tokens JWT...');
            console.log('👤 Usuario para tokens:', user.correo);
            
            const payload: JWTPayload = {
                userId: String((user as any)?._id),
                email: user.correo,
            };
            
            console.log('📝 Payload JWT:', payload);
            
            const accessToken = this.generateAccessToken(payload);
            const refreshToken = this.generateRefreshToken(payload);

            console.log('✅ STEP 4 COMPLETADO: Tokens generados exitosamente');
            console.log('🔑 Access Token generado');
            console.log('🔄 Refresh Token generado');
            
            return { accessToken, refreshToken };
        } catch (error) {
            console.error('❌ ERROR generando tokens:');
            console.error('Error details:', error);
            throw error;
        }
    }

    async loginWithGoogle(code: string, authType: 'register' | 'login' = 'register'): Promise<TokenResponse | null> {
        try {
            console.log('🚀 ========= INICIANDO LOGIN CON GOOGLE =========');
            console.log('📝 Tipo de autenticación:', authType);
            console.log('📝 Código recibido (longitud):', code.length, 'caracteres');

            // 1. Intercambiar código por tokens de Google
            console.log('🔄 STEP 1: Intercambiando código por tokens de Google...');
            const googleTokens = await this.exchangeCodeForTokens(code);
            console.log('✅ Tokens de Google recibidos');

            // 2. Obtener perfil del usuario
            console.log('🔄 STEP 2: Obteniendo perfil del usuario...');
            const profile = await this.getGoogleUserProfile(googleTokens.access_token);
            console.log('✅ Perfil de Google obtenido');

            // 3. Buscar o crear usuario (PASANDO EL authType)
            console.log('🔄 STEP 3: Buscando/creando usuario...');
            const userDoc = await this.findOrCreateUser(profile, authType);
            
            if (userDoc === null) {
                if (authType === 'register') {
                    console.log('ℹ️ Usuario ya registrado durante registro');
                    return null;
                } else {
                    console.log('❌ Usuario no existe durante login');
                    throw new Error('Usuario no encontrado');
                }
            }

            console.log('✅ Usuario preparado para autenticación');

            // 4. Generar tokens JWT
            console.log('🔄 STEP 4: Generando tokens JWT...');
            const tokens = this.generateTokens(userDoc as UsuarioDocument);
            
            // 5. Preparar respuesta para el cliente
            console.log('🔄 STEP 5: Preparando respuesta para el cliente...');
            const userForClient = {
                nombre: userDoc.nombre,
                correo: userDoc.correo,
                fotoPerfil: userDoc.fotoPerfil,
                terminosYCondiciones: userDoc.terminosYCondiciones,
            };

            const response: TokenResponse = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: userForClient,
                expiresAt: new Date(),
            };

            console.log('✅ ========= LOGIN CON GOOGLE COMPLETADO EXITOSAMENTE =========');
            return response;

        } catch (error: unknown) {
            console.error('❌ ========= ERROR CRÍTICO EN LOGIN CON GOOGLE =========');
            
            if (error instanceof Error) {
                console.error('📝 Error message:', error.message);
                console.error('🔍 Stack trace:', error.stack);
            } else {
                console.error('📝 Unknown error:', error);
            }
            
            throw error;
        }
    }
}