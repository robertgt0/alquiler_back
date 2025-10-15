import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
    GOOGLE_CLIENT_ID: z.string().min(5),
    GOOGLE_CLIENT_SECRET: z.string().min(5),
    GOOGLE_REDIRECT_URI: z.string().url(),
    GMAIL_USER: z.string().default('me'),
    PUBSUB_VERIFICATION_TOKEN: z.string().optional(),
    PORT: z.string().optional()
});

export const env = EnvSchema.parse(process.env);
