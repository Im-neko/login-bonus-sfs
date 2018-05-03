"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
const handleGET = (req, res) => {
    // Do something with the GET request
    res.status(200).json({ message: 'Get func' });
};
const handlePUT = (req, res) => {
    // Do something with the PUT request
    res.status(200).json({ message: 'Put func' });
};
const handlePOST = (req, res) => {
    // Do something with the POST request
    res.status(200).json({ message: 'Post func' });
};
exports.user = functions.https.onRequest((req, res) => {
    switch (req.method) {
        case 'GET':
            handleGET(req, res);
            break;
        case 'PUT':
            handlePUT(req, res);
            break;
        case 'POST':
            handlePOST(req, res);
        default:
            res.status(500).json({ error: 'Something blew up!' });
            break;
    }
});
//# sourceMappingURL=user.controller.js.map