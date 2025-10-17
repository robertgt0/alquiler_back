import Fastify from 'fastify';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import oauthRoutes from './routes/oauth.js';
import notifyRoutes from './routes/notify.js';

export async function startServer() {
    const app = Fastify({ logger });

    app.register(oauthRoutes, { prefix: '/oauth' });
    app.register(notifyRoutes, { prefix: '/notify' });

    const port = Number(env.PORT ?? 3000);
    await app.listen({ host: '0.0.0.0', port });
    app.log.info({ port }, 'Servidor levantado');
}
