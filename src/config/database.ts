import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️  MONGO_URI no está definido; no se conectará a Mongo.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error al conectar MongoDB:", err);
  }
}
