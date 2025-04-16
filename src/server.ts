import * as net from 'net';
import { connectToMongo, getDb } from './db/db';
import { decode} from './lib/cbor';

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
                const parsed = decode(buffer); // CBOR → JSON
                console.log("📥 Donnée décodée :", parsed);

                const { name, position } = parsed;
                if (!name || !position?.latitude || !position?.longitude) {
                    throw new Error("❌ Donnée invalide");
                }

                const data: DataPoint = {
                    name,
                    position: {
                        latitude: parseFloat(position.latitude),
                        longitude: parseFloat(position.longitude)
                    },
                    receivedAt: new Date()
                };

                const result = await collection.insertOne(data);
                console.log("✅ Document inséré :", result.insertedId);
                socket.write("✅ Donnée CBOR enregistrée\n");
            } catch (err) {
                console.error("❌ Erreur serveur :", err);
                socket.write("❌ Erreur de décodage ou format\n");
            }
        });

        socket.on('end', () => console.log("🔌 Client déconnecté"));
        socket.on('error', (err) => console.error("⚠️ Socket error:", err.message));
    });

    server.listen(4000, () => {
        console.log("🚀 Serveur TCP CBOR actif sur le port 4000");
    });
}

startServer();