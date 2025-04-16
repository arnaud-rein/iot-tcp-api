// client.ts
import * as net from 'net';


const client = new net.Socket();

client.connect(5000, 'localhost', () => {
    const bloc = [
        'test;51.85;2.35'

    ].join('\n');

    client.write(bloc);
    client.end();
});

client.on('close', () => {
    console.log('Connexion TCP fermée');
});

client.on('error', (err) => {
    console.error('Erreur client TCP :', err.message);
});
