// src/db.ts
import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb://localhost:27017'; // ou un URI distant
const dbName = 'iot';

let client: MongoClient;
let db: Db;

export async function connectToMongo() {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connecté à MongoDB");
}

export function getDb(): Db {
    if (!db) throw new Error("MongoDB non connecté !");
    return db;
}
