import { IUser } from "../interfaces/user.interface";

export interface LoginRequest {
    email: string;
    password: string;
    twoFactorToken?: string;
}

export interface LoginResponse {
    requiresTwoFactor: boolean;
    accessToken?: string;
    refreshToken?: string;
    user?: Partial<IUser>;
}