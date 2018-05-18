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
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const corsHandler = cors({ origin: true });
const handleGET = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the GET request
    try {
        let db = admin.firestore();
        let data = [];
        let VersionRef = yield db.doc('version/latest');
        VersionRef.get().then((snapshot) => {
            if (snapshot.exists) {
                let d = {};
                d = snapshot.data();
                res.status(200).json({ message: 'success', data: d, error: null });
            }
            else {
                res.status(404).json({ message: 'not found', data: null, error: 404 });
            }
        }).catch((e) => {
            res.status(500).json({ message: 'DBError', data: null, error: 500 });
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', error: 500 });
    }
}); // }}}
const handlePOST = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the POST request
    try {
        const schoolId = req.body.schoolId;
        let db = admin.firestore();
        let VersionRef = yield db.doc('version/latest');
        let setVersion = yield VersionRef.set({
            version: req.body.version
        }); // }}}
        res.status(200).json({ message: 'success', error: null });
    }
    catch (e) {
        console.log(req.body);
        console.error(e);
        res.status(500).json({ message: 'Internal Server Error', error: 500 });
    }
}); // }}}
exports.versionController = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        switch (req.method) {
            case 'GET':
                yield handleGET(req, res);
                break;
            case 'POST':
                yield handlePOST(req, res);
                break;
            default:
                res.status(500).json({ error: 'somethong brew up' });
                break;
        }
    }));
})); // }}}
//# sourceMappingURL=index.js.map