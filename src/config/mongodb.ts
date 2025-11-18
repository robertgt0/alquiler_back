import { MongoClient } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI || "";
if (!uri) {
  throw new Error("Por favor define MONGODB_URI en tu .env");
}

if (process.env.NODE_ENV === "development") {
  // Reutilizar el cliente en desarrollo para evitar múltiples conexiones
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // En producción, crear un nuevo cliente
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
