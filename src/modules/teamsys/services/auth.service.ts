import axios from "axios";
import jwt from "jsonwebtoken";
import { UsuarioDocument } from "../types";
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
            const requestBody = {
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URL,
                grant_type: 'authorization_code',
            };

            const { data } = await axios.post<GoogleTokenResponse>(this.googleTokenUrl, requestBody);

            return data;
        } catch (error: any) {
            throw new Error('Failed to exchange code for tokens');
        }
    }

    async getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const { data } = await axios.get<GoogleTokenResponse>(
                this.googleUserInfoUrl,
                {
                    headers: headers
                }
            );

            return data;
        } catch (error: any) {
            throw new Error('Failed to fetch user profile from google');
        }
    }

    async findOrCreateUser(profile: GoogleUserProfile): Promise<UsuarioDocument> {
        let user = await teamsysService.getByEmail(profile.email);
        console.log({user})
        if (! user) {
            user = await teamsysService.create({
                nombre: profile.name,
                correoElectronico: profile.email,
                //fotoPerfil: profile.picture,
                terminosYCondiciones: true,
            });
        }

        return user!;
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
            userId: user._id.toString(),
            email: user.correoElectronico,
        }
        
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    async loginWithGoogle(code: string): Promise<TokenResponse> {
        const googleTokens = await this.exchangeCodeForTokens(code);

        const profile = await this.getGoogleUserProfile(googleTokens.access_token);

        const user = await this.findOrCreateUser(profile);
        if (user==null)return null;

        const tokens = this.generateTokens(user); 

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: user,
            expiresAt: new Date(),
        }
    }
}