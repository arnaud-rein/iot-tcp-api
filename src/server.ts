import net from 'net';

const server = net.createServer((socket) => {
    console.log('Nouvelle connexion !');

    socket.on('data', (data) => {
        console.log(`Données reçues : ${data.toString()}`);
        socket.write(`Message bien reçu : ${data}`);
    });

    socket.on('end', () => {
        console.log('Connexion terminée.');
    });

    socket.on('error', (err) => {
        console.error(`Erreur socket : ${err.message}`);
    });
});

server.listen(4000, '127.0.0.1', () => {
    console.log('Serveur TCP à l’écoute sur le port 4000');
});
