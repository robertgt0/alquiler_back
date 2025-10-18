import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;
  if (!uri) {
    throw new Error('❌ Falta MONGODB_URI (o MONGO_URI) en .env');
  }

  await mongoose.connect(uri);
  const dbName = mongoose.connection.db?.databaseName || '(desconocida)';
  console.log(`✅ Mongo conectado: ${dbName}`);
}