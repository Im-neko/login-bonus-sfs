"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const user = require("./user");
const ranking = require("./ranking");
const sha256 = require("./sha256");
admin.initializeApp(functions.config().firebase);
exports.userapi = user.userController;
exports.rankingapi = ranking.rankingController;
exports.sha256api = sha256.sha256Controller;
//# sourceMappingURL=index.js.map