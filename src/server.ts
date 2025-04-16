// tcp-server/index.ts
import net from 'net';
import axios from 'axios';
import { encode, decode } from './lib/cbor';

// Exemple d'utilisation
const obj = { temperature: 22.4, humidity: 45 };
const encoded = encode(obj);
console.log("Encoded CBOR buffer:", encoded);

const decoded = decode(encoded as Uint8Array);
console.log("Decoded object:", decoded);


const server = net.createServer((socket) => {
    console.log('Client connecté');

    socket.on('data', async (data) => {
        const message = data.toString();
        console.log('Message TCP reçu :', message);

        // Envoie le message à Express via HTTP
        try {
            const response = await axios.post('http://localhost:3000/tcp-data', {
                message
            });
            console.log('Réponse d\'Express :', response.data);
        } catch (error) {
            console.error('Erreur en envoyant à Express:');
        }
    });

    socket.on('end', () => {
        console.log('Client déconnecté');
    });
});

server.listen(5000, () => {
    console.log('Serveur TCP écoute sur le port 5000');
});


const test = { status: "ok", value: 42 };
const bin = encode(test);
console.log("CBOR:", bin);

const parsed = decode(bin as Uint8Array);
console.log("CBOR Decoded:", parsed);
