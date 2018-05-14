import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

import * as cors from 'cors';
const corsHandler = cors({origin: true});


const handleGET = async (req, res) => { // {{{
  // Do something with the GET request
  try{
    let db = admin.firestore();

    /*
    * let snapshot = await db.collection('users').get();
    * snapshot.forEach((doc) => { });
    * なんか挙動が違くて動かない
    */
    const schoolId = req.query['schoolId'];
    let data = [];
    if (schoolId) {
      let aUserRef = await db.doc('users/'+schoolId);
      aUserRef.get().then((snapshot) => {
        if (snapshot.exists) {
          let d = {};
          d = snapshot.data();
          d['updated'] = snapshot.updateTime;
          d['created']= snapshot.createTime;
          res.status(200).json({message: 'success', data: d, error: null});
        }else{
          res.status(404).json({message: 'not found', data: snapshot.data(), error: 404});
        }
      }).catch((e) => {
        res.status(404).json({message: 'Internal Server Error', data: null, error: 500});
      });
    }else{
      db.collection('users').get()
      .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            data = data.concat(doc.data());
        });
        res.status(200).json({message: 'success', data: data, error: null});
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });
    }
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', error: 500});
  }
}// }}}

const handlePUT = async (req, res) => { // {{{
  // Do something with the PUT request
  try{
    const schoolId = req.body.schoolId;
    let db = admin.firestore();
    let aUserRef = await db.doc('users/'+schoolId);
    let setUser = await aUserRef.update({ // {{{
      max_count: req.body.max_count,
      now_count: req.body.now_count,
      last_login: req.body.last_login
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
    res.status(200).json({message: 'success', data: null, error: null})
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', data:null, error: 500});
  }
} // }}}

const handlePOST = async (req, res) => { // {{{
  // Do something with the POST request
  try{
    const schoolId = req.body.schoolId;
    let db = admin.firestore();
    let aUserRef =  await db.doc('users/'+schoolId);
    let setUser = await aUserRef.set({ // {{{
      schoolId: req.body.schoolId,
      idToken: req.body.idToken,
      username: req.body.username,
      max_count: req.body.max_count,
      now_count: req.body.now_count,
      last_login: req.body.last_login
    }); // }}}
    res.status(200).json({message: 'success', error: null})
  } catch(e) {
    console.log(req.body)
    console.error(e)
    res.status(500).json({message: 'Internal Server Error', error: 500});
  }
} // }}}

export const userController = functions.https.onRequest(async (req, res) => { // {{{
  corsHandler(req, res, async () => {
    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.status(500).json({ error: 'somethong brew up' });
        break;
    }
  });
}); // }}}
