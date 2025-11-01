import axios from "axios";
import * as jwt from 'jsonwebtoken';
import { CrearUsuarioDto } from "../types";
import { AuthTokens, GoogleTokenResponse, GoogleUserProfile, JWTPayload } from "../types/auth.types";
import { TokenResponse } from "../types/token.types";
import teamsysService from '../services/teamsys.service';
type Secret = jwt.Secret;
type SignOptions = jwt.SignOptions;
type JwtPayload = jwt.JwtPayload;
type AppJWTPayload = JwtPayload & { userId: string; email: string };
import mongoose from "mongoose";
import { UserDocument } from "../models/teamsys";

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
        console.log(user)
        if (!user) {
            return  {
                nombre: profile.name,
                correo: profile.email,
                fotoPerfil: profile.picture,
                terminosYCondiciones: true,
            }
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

    generateTokens(user: UserDocument): AuthTokens {
        const payload: JWTPayload = {
            userId: (user._id as mongoose.Types.ObjectId).toString(),
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

    async loginWithGoogle(code: string): Promise<{user: any}> {
        const googleTokens = await this.exchangeCodeForTokens(code);

        const profile = await this.getGoogleUserProfile(googleTokens.access_token);

        const userDoc = await this.findOrCreateUser(profile);
        if (userDoc==null) return {user: null};

        // const tokens = this.generateTokens(userDoc); 
        // const userForClient= {
        //     nombre: userDoc.nombre,
        //     correo: userDoc.correo,
        //     fotoPerfil:userDoc.fotoPerfil,
        //     terminosYCondiciones: userDoc.terminosYCondiciones,
        //     apellido: userDoc.apellido,
        //     telefono: userDoc.telefono,
        //     si quieres la foto de Google, pásala desde el service como campo aparte:
        //     fotoPerfil: profile.picture,
        // };

        return {
            // accessToken: tokens.accessToken,
            // refreshToken: tokens.refreshToken,
            user: {
                nombre: profile.given_name,
                correo: profile.email,
                fotoPerfil: profile.picture,
                telefono: '121515454545'
                // terminosYCondiciones: true
            }
        }
    }
}