import { FastifyPluginAsync } from 'fastify';
import { env } from '../config/env.js';
import { getAuthorizedClient } from '../config/google.js';
import { changesSince, latestHistoryId, getMessageParsed } from '../services/gmail.js';

const routes: FastifyPluginAsync = async (app) => {
  // Endpoint para Pub/Sub push o pruebas internas
    app.post('/', async (req, res) => {
        // Verificación opcional de token compartido
        const token = req.headers['x-verification-token'];
        if (env.PUBSUB_VERIFICATION_TOKEN && token !== env.PUBSUB_VERIFICATION_TOKEN) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    const body: any = req.body;
    // Si viene de Pub/Sub (mensaje en base64)
    let historyId: number | null = null;
    try {
        const message = body?.message?.data;
        if (message) {
            const decoded = JSON.parse(Buffer.from(message, 'base64').toString('utf8'));
            historyId = Number(decoded?.historyId ?? 0) || null;
        }
    } catch {
        historyId = Number(body?.historyId ?? 0) || null;
    }

    const client = await getAuthorizedClient();

    if (!historyId) {
      // obtener uno inicial
        historyId = await latestHistoryId(client);
        if (!historyId) return res.status(204).send();
    }

    const history = await changesSince(client, historyId);
    for (const h of history) {
        for (const add of h.messagesAdded ?? []) {
            const id = add.message?.id;
            if (!id) continue;
            const msg = await getMessageParsed(client, id);
            app.log.info({
            id,
            from: msg.parsed.from?.text,
            subject: msg.parsed.subject
            }, '📥 Nuevo mensaje');
            // TODO: aquí disparas tu lógica de negocio (guardar en BD, notificar, etc.)
        }
    }

    return res.status(204).send(); // acuse OK
    });
};

export default routes;
