"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client.ts
var net = require("net");
var client = new net.Socket();
client.connect(5000, 'localhost', function () {
    var bloc = [
        'test;51.85;2.35'
    ].join('\n');
    client.write(bloc);
    client.end();
});
client.on('close', function () {
    console.log('Connexion TCP fermée');
});
client.on('error', function (err) {
    console.error('Erreur client TCP :', err.message);
});
