import mongoose from "mongoose";

export default async function connectDB() {
  try {
    // 🔧 Corregido: el nombre de variable coincide con .env
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/alquiler_db";

    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  }
}

