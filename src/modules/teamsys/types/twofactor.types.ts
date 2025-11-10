export interface TwoFactorSetupResponse {
    secret: string;
    qrCode: string;
    backupCodes?: string[];
}

export interface TwoFactorVerifyRequest {
    userId: string;
    token: string;
}