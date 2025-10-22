// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function getMongoUri() {
  return process.env.MONGODB_URI ?? process.env.MONGO_URI ?? '';
}

export async function connectDB(strict: boolean = true): Promise<void> {
  const uri = getMongoUri();

  if (!uri) {
    const message = 'La variable MONGODB_URI no está definida en .env';
    if (strict) {
      throw new Error(message);
    }
    console.warn(`⚠️  ${message}`);
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log(strict ? 'MongoDB conectado correctamente' : '✅ MongoDB conectado');
  } catch (error) {
    if (strict) {
      console.error('Error al conectar con MongoDB:', error);
      process.exit(1);
    } else {
      console.error('❌ Error al conectar MongoDB:', error);
    }
  }
}

export default function connectDBOptional(): Promise<void> {
  return connectDB(false);
}