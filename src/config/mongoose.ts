import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI);
  const dbName = mongoose.connection.db?.databaseName ?? '(desconocida)';
  console.log(`✅ Mongo conectado: ${dbName}`);
}
