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
import mongoose from "mongoose";
import { UserDocument } from "../models/teamsys";
import { MagicLink } from '../models/magic-link.model'; 
import teamsysService1 from './teamsys.service';
//import teamsysService from './teamsys.service';

export class AuthService  {
    
    private readonly googleTokenUrl = "https://oauth2.googleapis.com/token";
    private readonly googleUserInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
    private readonly jwtSecret: Secret;
    private readonly jwtRefreshSecret: Secret;
    private readonly accessTokenExpiry: string;
    private readonly refreshTokenExpiry: string;

    constructor() {
        const s = process.env.JWT_SECRET ?? "servineoapptest123";
    const rs = process.env.JWT_REFRESH_SECRET ?? "servineoapptest123";
    if (!s || !rs) throw new Error("JWT secrets no estan configurados");

    this.jwtSecret = s as Secret;
    this.jwtRefreshSecret = rs as Secret;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN ?? "1h";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
    }

    async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
        try {
            const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  redirect_uri: process.env.GOOGLE_REDIRECT_URL!, // (ojo con el nombre de env)
    grant_type: 'authorization_code',
});

const { data } = await axios.post<GoogleTokenResponse>(
    this.googleTokenUrl,
    body,
    { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
);
return data; // ahora sí es GoogleUserProfile
        } catch (error: any) {
            throw new Error('Failed to exchange code for tokens');
        }
    }

    async getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
    try {
    const headers = { Authorization: `Bearer ${accessToken}` };

    //  antes: axios.get<GoogleTokenResponse>(...)
    const { data } = await axios.get<GoogleUserProfile>(this.googleUserInfoUrl, { headers });

    return data;
    } catch (error: any) {
    throw new Error('Failed to fetch user profile from google');
    }
}


    async findOrCreateUser(profile: GoogleUserProfile): Promise<CrearUsuarioDto | null> {
        let user = await teamsysService.verificarCorreo(profile.email);
        //console.log(user)
        
        if (user!=null) {
            
            return {
                nombre: profile.name,
                correo: profile.email,
                fotoPerfil: profile.picture,
                authProvider:user.authProvider,
                terminosYCondiciones: true,}

        }

        return null;
    }

    private signToken(payload: AppJWTPayload, secret: Secret, expiresIn: string): string {
      const opts = { expiresIn } as SignOptions;
      return jwt.sign(payload, secret, opts);
` `}

    generateAccessToken(payload: JWTPayload): string {
        return this.signToken(payload, this.jwtSecret, this.accessTokenExpiry 
        );
    }

    generateRefreshToken(payload: AppJWTPayload): string {
    return this.signToken(payload, this.jwtRefreshSecret, this.refreshTokenExpiry);
  }

    generateTokens(user: UsuarioDocument | UserDocument): AuthTokens {
        console.log({user});
        const payload: JWTPayload = {
            // userId: (user._id as mongoose.Types.ObjectId).toString(),
            userId: String((user as any)?._id),
            email: user.correo, 
        }

        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    verifyAccessToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as JWTPayload;
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    async loginWithGoogle(code: string): Promise<TokenResponse> {
        const googleTokens = await this.exchangeCodeForTokens(code);

        const profile = await this.getGoogleUserProfile(googleTokens.access_token);

        const userDoc = await this.findOrCreateUser(profile);
        let userForClient: CrearUsuarioDto;
        
        if (userDoc==null) {
            userForClient= {
            nombre: profile.name,
            correo: profile.email,
            fotoPerfil:profile.picture,
            authProvider:"google",
            terminosYCondiciones: false,
        //     apellido: userDoc.apellido,
        //     telefono: userDoc.telefono,
        //     si quieres la foto de Google, pásala desde el service como campo aparte:
        //     fotoPerfil: profile.picture,
        }
      }
        else{
            userForClient= {
            nombre: userDoc.nombre,
            correo: userDoc.correo,
            fotoPerfil:userDoc.fotoPerfil,
            authProvider:userDoc.authProvider,
            terminosYCondiciones: true,
        //     apellido: userDoc.apellido,
        //     telefono: userDoc.telefono,
        //     si quieres la foto de Google, pásala desde el service como campo aparte:
        //     fotoPerfil: profile.picture,
        };
        }
        if(userDoc!=null){
        const tokens = this.generateTokens(userDoc as UsuarioDocument); 
        

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userForClient,
            expiresAt: new Date(),
        }}else return {
            accessToken: "",
            refreshToken: "",
            user: userForClient,
            expiresAt: new Date(),
        }
    }
    async generateMagicLinkToken(email: string): Promise<string> {
  // Verificar si el correo existe en la BD
  const userExists = await teamsysService.verificarCorreo(email);
  
  if (!userExists) {
    console.log("correo no esta en la BD");
    throw new Error('Correo no registrado');
  }

  // Obtener el usuario completo usando teamsysService
  const user = await teamsysService.getUserByEmail(email);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Generar token único
  const token = jwt.sign(
    { 
      email: email, 
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      type: 'magic_link' 
    },
    this.jwtSecret,
    { expiresIn: '5m' }
  );

  // Guardar token en BD
  const magicLinkDoc = new MagicLink({
    token: token,
    email: email,
    userId: (user._id as mongoose.Types.ObjectId).toString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos
    used: false
  });

  await magicLinkDoc.save();

  return token;
}

//h4 magic link
/**
 * Verificar token de magic link
 */
async verifyMagicLinkToken(token: string): Promise<JWTPayload> {
  try {
    // Verificar en BD primero
    const magicLink = await MagicLink.findOne({ 
      token: token,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!magicLink) {
      throw new Error('Token inválido o expirado');
    }

    // Verificar JWT
    const payload = this.verifyAccessToken(token) as JWTPayload;

    // Marcar como usado
    magicLink.used = true;
    await magicLink.save();

    return payload;
  } catch (error) {
    throw new Error('Token de magic link inválido');
  }
}

/**
 * Obtener usuario por email
 */
async getUserByEmail(email: string): Promise<import("../models/teamsys").UserDocument | null> {
  const Usuario = require('../models/teamsys').default;
  return await Usuario.findOne({ correo: email });
}
}