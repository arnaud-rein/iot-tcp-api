import * as net from 'net';

const client = new net.Socket();

client.connect(4000, 'localhost', () => {
    const bloc = 'testtestestet;777.85;2.35';
    console.log("📤 Envoi :", bloc);

    // On attend que le message soit écrit avant de fermer
    client.write(bloc, () => {
        console.log("✅ Message envoyé");
        // Ne ferme la connexion qu'après envoi complet
        client.end();
    });
});

client.on('data', (data) => {
    console.log("📥 Réponse du serveur :", data.toString());
});

client.on('close', () => {
    console.log('🔌 Connexion TCP fermée');
});

client.on('error', (err) => {
    console.error('❌ Erreur client TCP :', err.message);
});
