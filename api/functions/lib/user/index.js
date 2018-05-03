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
const handleGET = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the GET request
    try {
        let db = admin.firestore();
        /*
        * let snapshot = await db.collection('users').get();
        * snapshot.forEach((doc) => { });
        * なんか挙動が違くて動かない
        */
        const id = req.query['id'];
        let data = [];
        if (id) {
            let aUserRef = yield db.doc('users/' + id);
            aUserRef.get().then((snapshot) => {
                if (snapshot.exists) {
                    let d = {};
                    d = snapshot.data();
                    d['updated'] = snapshot.updateTime;
                    d['created'] = snapshot.createTime;
                    res.status(200).json({ message: 'success', data: d, error: null });
                }
                else {
                    res.status(404).json({ message: 'not found', data: snapshot.data(), error: 404 });
                }
            }).catch((e) => {
                res.status(404).json({ message: 'Internal Server Error', data: null, error: 500 });
            });
        }
        else {
            db.collection('users').get()
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
        }
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', error: 500 });
    }
}); // }}}
const handlePUT = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the PUT request
    try {
        const idToken = req.body.idToken;
        let db = admin.firestore();
        let aUserRef = yield db.doc('users/' + idToken);
        let setUser = yield aUserRef.set({
            schoolId: req.bcody.schoolId,
            idToken: req.body.idToken,
            username: req.body.username,
            max_count: req.body.max_count,
            now_count: req.body.now_count
        }); // }}}
        /*
        // {{{
        let date = new Date.getTime();
    
        let allRef = firestore.collection('ranking-all');
        let weekRef = firestore.doc('ranking-week/'+idToken);
        let monthRef = firestore.doc('ranking-month/'+idToken);
        let setAll = await allRef.set({ // {{{
          schoolId: req.body.schoolId,
          idToken: req.body.idToken,
          username: req.body.username,
          max_count: req.body.max_count,
          now_count: req.body.now_count
        }); // }}}
        let setWeek = await WeekRef.set({ // {{{
          schoolId: req.body.schoolId,
          idToken: req.body.idToken,
          username: req.body.username,
          max_count: req.body.max_count,
          now_count: req.body.now_count
        }); // }}}
        let setMonth = await MonthRef.set({ // {{{
          schoolId: req.body.schoolId,
          idToken: req.body.idToken,
          username: req.body.username,
          max_count: req.body.max_count,
          now_count: req.body.now_count
        }); // }}}
        // }}}
        */
        res.status(200).json({ message: 'success', data: null, error: null });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', data: null, error: 500 });
    }
}); // }}}
const handlePOST = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Do something with the POST request
    try {
        const idToken = req.body.idToken;
        let db = admin.firestore();
        let aUserRef = yield db.doc('users/' + idToken);
        let setUser = yield aUserRef.set({
            schoolId: req.body.schoolId,
            idToken: req.body.idToken,
            username: req.body.username,
            max_count: req.body.max_count,
            now_count: req.body.now_count
        }); // }}}
        res.status(200).json({ message: 'success', error: null });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error', error: 500 });
    }
}); // }}}
exports.userController = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Access-Control-Allow-Origin', "*");
    switch (req.method) {
        case 'GET':
            yield handleGET(req, res);
            break;
        case 'PUT':
            yield handlePUT(req, res);
            break;
        case 'POST':
            yield handlePOST(req, res);
        default:
            res.status(500).json({ error: 'Something blew up!' });
            break;
    }
})); // }}}
//# sourceMappingURL=index.js.map