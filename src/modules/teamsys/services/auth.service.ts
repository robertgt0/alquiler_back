import axios from "axios";
import jwt from "jsonwebtoken";
import { UsuarioDocument, CrearUsuarioDto } from "../types";
import { AuthTokens, GoogleTokenResponse, GoogleUserProfile, JWTPayload } from "../types/auth.types";
import { TokenResponse } from "../types/token.types";
import teamsysService from '../services/teamsys.service';

export class AuthService  {
    private readonly googleTokenUrl = "https://oauth2.googleapis.com/token";
    private readonly googleUserInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
    private readonly jwtSecret: string;
    private readonly jwtRefreshSecret: string;
    private readonly accessTokenExpiry: string;
    private readonly refreshTokenExpiry: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET! || 'servineoapptest123';
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET! || 'servineoapptest123';
        this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '1h';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

        if(! this.jwtSecret || ! this.jwtRefreshSecret) {
            throw new Error('JWT secrets no estan configurados');
        }
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


    async findOrCreateUser(profile: GoogleUserProfile): Promise<CrearUsuarioDto> {
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

    generateAccessToken(payload: JWTPayload): string {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.accessTokenExpiry,
        });
    }

    generateRefreshToken(payload: JWTPayload): string {
        return jwt.sign(payload, this.jwtRefreshSecret, {
            expiresIn: this.refreshTokenExpiry,
        });
    }

    generateTokens(user: UsuarioDocument): AuthTokens {
        console.log({user})
        const payload: JWTPayload = {
            userId: String((user as any)?._id),
            email: user.correo,
        }
        
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    async loginWithGoogle(code: string): Promise<TokenResponse> {
        const googleTokens = await this.exchangeCodeForTokens(code);

        const profile = await this.getGoogleUserProfile(googleTokens.access_token);

        const userDoc = await this.findOrCreateUser(profile);
        if (userDoc==null)return null;

        const tokens = this.generateTokens(userDoc as UsuarioDocument); 
        const userForClient= {
    nombre: userDoc.nombre,
    correo: userDoc.correo,
    fotoPerfil:userDoc.fotoPerfil,
    terminosYCondiciones: userDoc.terminosYCondiciones,
    //apellido: userDoc.apellido,
    //telefono: userDoc.telefono,
    // si quieres la foto de Google, pásala desde el service como campo aparte:
    // fotoPerfil: profile.picture,
    };
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userForClient ,
            expiresAt: new Date(),
        }
    }
}