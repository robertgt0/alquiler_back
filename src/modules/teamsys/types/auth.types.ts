export interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface JWTPayload {
    userId: string;
    email:string;
    iat?: number;
    exp?: number;
}

export interface GoogleUserProfile {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale?: string;
}