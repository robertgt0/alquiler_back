import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import { loadToken, saveToken } from '../store/tokenStore.js';

export function createOAuthClient() {
    return new OAuth2Client(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.GOOGLE_REDIRECT_URI
    );
}

export async function getAuthorizedClient(): Promise<OAuth2Client> {
    const client = createOAuthClient();
    const creds = await loadToken();
    if (creds) client.setCredentials(creds);
    return client;
}

export async function exchangeCodeAndPersist(code: string): Promise<OAuth2Client> {
    const client = createOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    await saveToken(tokens);
    return client;
}
