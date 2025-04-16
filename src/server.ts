import * as net from 'net';
import { connectToMongo, getDb } from './db/db';

interface Position {
    latitude: number;
    longitude: number;
}

interface DataPoint {
    name: string;
    position: Position;
    receivedAt?: Date;
}

async function startServer() {
    await connectToMongo();
    const db = getDb();
    const collection = db.collection<DataPoint>('mesures');

    const server = net.createServer((socket) => {
        console.log("📡 Nouvelle connexion");

        socket.on('data', async (buffer) => {
            try {
                const text = buffer.toString().trim();
                console.log("📥 Reçu :", text);

                const parts = text.split(';');
                if (parts.length !== 3) {
                    throw new Error("❌ Format invalide (attendu : name;lat;lng)");
                }

                const name = parts[0].trim();
                const latitude = parseFloat(parts[1].trim());
                const longitude = parseFloat(parts[2].trim());

                if (isNaN(latitude) || isNaN(longitude)) {
                    throw new Error("❌ Latitude ou longitude invalide");
                }

                const data: DataPoint = {
                    name,
                    position: { latitude, longitude },
                    receivedAt: new Date()
                };

                console.log("📤 Insertion MongoDB :", data);

                const result = await collection.insertOne(data);
                console.log("✅ Document inséré avec _id :", result.insertedId);

                socket.write("✅ Donnée enregistrée\n");
            } catch (err) {
                console.error("❌ Erreur serveur :", err);
                socket.write("❌ Erreur serveur\n");
            }
        });

        socket.on('end', () => console.log("🔌 Client déconnecté"));
        socket.on('error', (err) => console.error("⚠️ Socket error:", err.message));
    });

    server.listen(4000, () => {
        console.log("🚀 Serveur TCP actif sur le port 4000");
    });
}

startServer();
