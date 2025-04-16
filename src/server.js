"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var db_1 = require("./db/db");
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var db, collection, server;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.connectToMongo)()];
                case 1:
                    _a.sent();
                    db = (0, db_1.getDb)();
                    collection = db.collection('mesures');
                    server = net.createServer(function (socket) {
                        console.log("📡 Nouvelle connexion");
                        socket.on('data', function (buffer) { return __awaiter(_this, void 0, void 0, function () {
                            var text, parts, name_1, latitude, longitude, data, result, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        text = buffer.toString().trim();
                                        console.log("📥 Reçu :", text);
                                        parts = text.split(';');
                                        if (parts.length !== 3) {
                                            throw new Error("❌ Format invalide (attendu : name;lat;lng)");
                                        }
                                        name_1 = parts[0].trim();
                                        latitude = parseFloat(parts[1].trim());
                                        longitude = parseFloat(parts[2].trim());
                                        if (isNaN(latitude) || isNaN(longitude)) {
                                            throw new Error("❌ Latitude ou longitude invalide");
                                        }
                                        data = {
                                            name: name_1,
                                            position: { latitude: latitude, longitude: longitude },
                                            receivedAt: new Date()
                                        };
                                        console.log("📤 Insertion MongoDB :", data);
                                        return [4 /*yield*/, collection.insertOne(data)];
                                    case 1:
                                        result = _a.sent();
                                        console.log("✅ Document inséré avec _id :", result.insertedId);
                                        socket.write("✅ Donnée enregistrée\n");
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _a.sent();
                                        console.error("❌ Erreur serveur :", err_1);
                                        socket.write("❌ Erreur serveur\n");
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        socket.on('end', function () { return console.log("🔌 Client déconnecté"); });
                        socket.on('error', function (err) { return console.error("⚠️ Socket error:", err.message); });
                    });
                    server.listen(4000, function () {
                        console.log("🚀 Serveur TCP actif sur le port 4000");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
startServer();
