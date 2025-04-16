"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var cbor_1 = require("./lib/cbor"); // adapte le chemin si besoin
// Données à envoyer
var message = {
    name: 'Volvic',
    position: {
        latitude: 888.85,
        longitude: 2.35
    }
};
// Encode avec CBOR
var encoded = (0, cbor_1.encode)(message);
// Vérifie si c'est une string ou un Uint8Array
var buffer = typeof encoded === 'string'
    ? Buffer.from(encoded, 'utf-8') // encodage texte si string
    : Buffer.from(encoded); // direct si Uint8Array
// Création du socket TCP
var client = new net.Socket();
client.connect(4000, 'localhost', function () {
    console.log("📡 Connecté au serveur");
    console.log("📤 Envoi CBOR :", message);
    client.write(buffer, function () {
        console.log("✅ Donnée envoyée");
        client.end(); // fermeture propre après envoi
    });
});
client.on('data', function (data) {
    console.log("📥 Réponse serveur :", data.toString());
});
client.on('close', function () {
    console.log("🔌 Connexion fermée");
});
client.on('error', function (err) {
    console.error("❌ Erreur client TCP :", err.message);
});
