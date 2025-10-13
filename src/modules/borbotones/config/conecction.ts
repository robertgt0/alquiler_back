import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI: string =
  process.env.MONGODB_URI ||
  "mongodb+srv://isindira:j5z3oE8XJx4kQb8V@isindira.nqvltjf.mongodb.net/isindira";

// Conexión principal con Mongoose
export async function testConnection(): Promise<typeof mongoose> {
  try {
    console.log("🔌 Conectando a MongoDB Atlas...");
    console.log(
      "📡 URI:",
      MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
    );

    // Conectar con timeout corto para prueba rápida
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 segundos
      socketTimeoutMS: 45000,
    });

    const db = mongoose.connection.db;
    const host = mongoose.connection.host;
    const readyState = mongoose.connection.readyState;

    console.log("✅ CONEXIÓN EXITOSA!");
    console.log("📊 Base de datos:", db?.databaseName || "Desconocida");
    console.log("🏠 Host:", host);
    console.log("📈 Estado:", readyState === 1 ? "Conectado" : "Desconectado");

    return mongoose;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ ERROR:", error.message);
    } else {
      console.error("❌ ERROR desconocido:", error);
    }

    // Información adicional para debug
    console.log("💡 Posibles soluciones:");
    console.log("1. Verifica tu conexión a internet");
    console.log("2. Agrega tu IP a la whitelist de MongoDB Atlas");
    console.log("3. Verifica que el cluster esté activo");
    console.log("4. Verifica que MONGODB_URI esté definida en .env");

    throw error;
  }
}

// Función para obtener cliente nativo de MongoDB (compatible con tu controlador)
export async function getMongoClient(): Promise<any> {
  try {
    await testConnection();
    // Retornar el cliente nativo de MongoDB
    return mongoose.connection.getClient();
  } catch (error) {
    console.error("Error obteniendo cliente MongoDB:", error);
    throw error;
  }
}

// Función para obtener la base de datos directamente
export async function getDatabase() {
  await testConnection();
  return mongoose.connection.db;
}

// ⭐ Ejecutar la prueba si se ejecuta directamente este archivo
if (require.main === module) {
  testConnection();
}

export const connectDB = testConnection;
export { MONGODB_URI };
export default mongoose;