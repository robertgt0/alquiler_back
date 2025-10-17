import { FastifyPluginAsync } from 'fastify';
import { getAuthorizedClient, exchangeCodeAndPersist, createOAuthClient } from '../config/google.js';
import { logger } from '../utils/logger.js';

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
];

const routes: FastifyPluginAsync = async (app) => {

    app.get('/url', async () => {
        const client = createOAuthClient();
        const url = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES
        });
        return { url };
    });
    app.get('/callback', async (req, res) => {
    const code = (req.query as any)?.code as string | undefined;
    if (!code) return res.status(400).send({ error: 'Missing code' });

    await exchangeCodeAndPersist(code);
    return res.send('✅ Autenticado. Token guardado en token.json');
    });
    app.get('/test', async () => {
        const client = await getAuthorizedClient();
        const { listUnread } = await import('../services/gmail.js');
        const ids = await listUnread(client, 5);
        return { unread: ids };
    });
};

export default routes;
