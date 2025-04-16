"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var client = new net.Socket();
client.connect(4000, 'localhost', function () {
    var bloc = 'testtestestet;777.85;2.35';
    console.log("📤 Envoi :", bloc);
    // On attend que le message soit écrit avant de fermer
    client.write(bloc, function () {
        console.log("✅ Message envoyé");
        // Ne ferme la connexion qu'après envoi complet
        client.end();
    });
});
client.on('data', function (data) {
    console.log("📥 Réponse du serveur :", data.toString());
});
client.on('close', function () {
    console.log('🔌 Connexion TCP fermée');
});
client.on('error', function (err) {
    console.error('❌ Erreur client TCP :', err.message);
});
