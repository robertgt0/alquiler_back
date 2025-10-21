// src/modules/notification/config/database.ts
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/alquiler_db";
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  }
}
