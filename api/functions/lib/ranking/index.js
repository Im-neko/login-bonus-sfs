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
const aUserRank = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.firestore();
    let aRankRef = yield db.doc('users/' + req.query.id);
    aRankRef.get().then(snapshot => {
        if (snapshot.exists) { // {{{
            let d = {};
            d = snapshot.data();
            d['updated'] = snapshot.updateTime;
            d['created'] = snapshot.createTime;
            res.status(200).json({ message: 'success', data: d, error: null });
        }
        else {
            res.status(404).json({ message: 'not found', data: snapshot.data(), error: null });
        } // }}}
    }).catch((e) => {
        console.log(e);
    });
}); // }}}
const allRank = (req, res) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.firestore();
    let allRef = yield db.collection('users');
    let data = [];
    allRef.get().then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            let d = {};
            d = doc.data();
            d['updated'] = doc.updateTime;
            d['created'] = doc.createTime;
            data = data.concat(d);
        });
    }).then(() => {
        res.status(200).json({ message: 'success', data: data, error: null });
    });
}); // }}}
const weekRank = (req, res) => __awaiter(this, void 0, void 0, function* () {
}); // }}}
const monthRank = (req, res) => __awaiter(this, void 0, void 0, function* () {
}); // }}}
const handleGET = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the GET request
    try {
        const query = req.query;
        let data = [];
        if (query) {
            switch (query.type) {
                case 'user':
                    yield aUserRank(req, res);
                    break;
                case 'all':
                    yield allRank(req, res);
                    break;
                case 'weelkly':
                    yield weekRank(req, res);
                    break;
                case 'monthly':
                    yield monthRank(req, res);
                    break;
                default:
                    res.status(500).json({ message: 'invalid type', data: null, error: 500 });
                    break;
            }
        }
        else { // {{{
            let db = admin.firestore();
            db.collection('ranking').get()
                .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    data = data.concat(doc.data());
                });
                res.status(200).json({ message: 'success', data: data, error: null });
            })
                .catch((err) => {
                console.log('Error getting documents', err);
            });
        } // }}}
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', data: null, error: 500 });
    }
}); // }}}
const handlePUT = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the PUT request
    try {
        const idToken = req.body.idToken;
        let db = admin.firestore();
        // let aRankRef = await db.collection('ranking').get(idToken);
        let aRankRef = db.doc('ranking/' + idToken);
        let setRank = yield aRankRef.update({
            schoolId: req.body.schoolId,
            idToken: req.body.idToken,
            rankingname: req.body.rankingname,
            max_count: req.body.max_count,
            now_count: req.body.now_count
        });
        res.status(200).json({ message: 'success', error: null });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', error: 500 });
    }
}); // }}}
const handlePOST = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the POST request
    try {
        const idToken = req.body.idToken;
        let db = admin.firestore();
        let aRankRef = yield db.collection('ranking').doc(idToken);
        console.log(aRankRef, typeof (aRankRef));
        let setRank = yield aRankRef.set({
            idToken: req.body.idToken,
            username: req.body.username,
            max_count: req.body.max_count,
            now_count: req.body.now_count
        });
        res.status(200).json({ message: 'success', error: null });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', error: 500 });
    }
}); // }}}
exports.rankingController = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    corsHandler(req, res, () => __awaiter(this, void 0, void 0, function* () {
        switch (req.method) {
            case 'GET':
                yield handleGET(req, res);
                break;
            case 'PUT':
                yield handlePUT(req, res);
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