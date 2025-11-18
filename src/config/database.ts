const mongoose = require("mongoose");

async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está definida en el entorno");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado correctamente");
  } catch (error: any) {
    console.error("❌ Error al conectar con MongoDB:", error);
    throw error;
  }
}

module.exports = connectDB;