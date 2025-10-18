import * as dotenv from 'dotenv';
dotenv.config();

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`❌ Falta variable de entorno: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  MONGODB_URI: required('MONGODB_URI'),
} as const;
