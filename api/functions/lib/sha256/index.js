"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
exports.sha256Controller = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Access-Control-Allow-Origin', "*");
    try {
        const text = req.body.text;
        let sha256 = crypto.createHash('sha256');
        sha256.update(text);
        const hash = sha256.digest('hex');
        res.status(200).json({ message: 'success', data: hash, error: null });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', data: null, error: 500 });
    }
})); // }}}
//# sourceMappingURL=index.js.map