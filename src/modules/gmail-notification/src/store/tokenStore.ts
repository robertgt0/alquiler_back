import fs from 'node:fs/promises';
import path from 'node:path';
import type { Credentials } from 'google-auth-library';

const TOKEN_PATH = path.resolve('token.json');

export async function loadToken(): Promise<Credentials | null> {
    try {
        const raw = await fs.readFile(TOKEN_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export async function saveToken(tokens: Credentials): Promise<void> {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
}
