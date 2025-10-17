import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import { simpleParser } from 'mailparser';

function gmail(auth: OAuth2Client) {
    return google.gmail({ version: 'v1', auth });
}

async function backoff<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
    try { return await fn(); }
    catch (e: any) {
        const status = e?.code || e?.response?.status;
        const retryable = [429, 500, 502, 503, 504].includes(Number(status));
        if (retryable && attempt <= 5) {
        const delay = Math.min(32000, 500 * 2 ** (attempt - 1));
        await new Promise(r => setTimeout(r, delay));
        return backoff(fn, attempt + 1);
        }
        throw e;
    }
}

export async function listUnread(auth: OAuth2Client, maxResults = 10) {
    const api = gmail(auth);
    const res = await backoff(() => api.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults
    }));
    return (res.data.messages ?? []).map(m => m.id);
}

export async function getMessageParsed(auth: OAuth2Client, id: string) {
    const api = gmail(auth);
    const res = await backoff(() => api.users.messages.get({ userId: 'me', id, format: 'raw' }));
    const rawB64 = res.data.raw!;
    const raw = Buffer.from(rawB64, 'base64');
    const parsed = await simpleParser(raw);
    return { id, parsed, raw };
}

export async function sendSimple(auth: OAuth2Client, params: { from: string; to: string; subject: string; text: string; }) {
    const api = gmail(auth);
    const lines = [
        `From: ${params.from}`,
        `To: ${params.to}`,
        `Subject: ${params.subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/plain; charset="UTF-8"`,
        '',
        params.text
    ].join('\r\n');

    const raw = Buffer.from(lines).toString('base64url');
    const res = await backoff(() => api.users.messages.send({
        userId: 'me',
        requestBody: { raw }
    }));
    return res.data.id;
}

export async function latestHistoryId(auth: OAuth2Client) {
    const api = gmail(auth);
    const list = await backoff(() => api.users.messages.list({ userId: 'me', maxResults: 1 }));
    const id = list.data.messages?.[0]?.id;
    if (!id) return null;
    const msg = await backoff(() => api.users.messages.get({ userId: 'me', id }));
    return Number(msg.data.historyId ?? 0) || null;
}

export async function changesSince(auth: OAuth2Client, startHistoryId: number) {
    const api = gmail(auth);
    const res = await backoff(() => api.users.history.list({
        userId: 'me',
        startHistoryId,
        historyTypes: ['messageAdded', 'labelAdded'],
        maxResults: 100
    }));
    return res.data.history ?? [];
}
