import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function getMongoUri(): string {
  return process.env.MONGODB_URI ?? process.env.MONGO_URI ?? '';
}

export async function connectDB(strict: boolean = true): Promise<void> {
  const uri = getMongoUri();

  if (!uri) {
    const message = 'MONGODB_URI no está definida en el entorno';
    if (strict) {
      throw new Error(message);
    }
    console.warn(`⚠️ ${message}`);
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    if (strict) {
      process.exit(1);
    }
  }
}

export function connectDBOptional(): Promise<void> {
  return connectDB(false);
}

export default function connectDBStrict(): Promise<void> {
  return connectDB(true);
}

