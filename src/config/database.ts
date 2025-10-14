import mongoose from "mongoose";

const connectDB = async (): Promise<mongoose.Connection["db"]> => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB conectado exitosamente");
    return connection.connection.db; // 👈 devolvemos la base de datos nativa
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
    process.exit(1);
  }
};
export default connectDB;
