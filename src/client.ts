import * as net from 'net';
import { encode } from './lib/cbor'; // adapte le chemin si besoin

// Données à envoyer
const message = {
    name: 'Volvic',
    position: {
        latitude: 888.85,
        longitude: 2.35
    }
};

// Encode avec CBOR
const encoded = encode(message);

// Vérifie si c'est une string ou un Uint8Array
const buffer = typeof encoded === 'string'
    ? Buffer.from(encoded, 'utf-8') // encodage texte si string
    : Buffer.from(encoded);         // direct si Uint8Array

// Création du socket TCP
const client = new net.Socket();

client.connect(4000, 'localhost', () => {
    console.log("📡 Connecté au serveur");
    console.log("📤 Envoi CBOR :", message);

    client.write(buffer, () => {
        console.log("✅ Donnée envoyée");
        client.end(); // fermeture propre après envoi
    });
});

client.on('data', (data) => {
    console.log("📥 Réponse serveur :", data.toString());
});

client.on('close', () => {
    console.log("🔌 Connexion fermée");
});

client.on('error', (err) => {
    console.error("❌ Erreur client TCP :", err.message);
});
