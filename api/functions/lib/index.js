"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const user = require("./user");
const ranking = require("./ranking");
admin.initializeApp(functions.config().firebase);
exports.userapi = user.userController;
exports.rankingapi = ranking.rankingController;
//# sourceMappingURL=index.js.map