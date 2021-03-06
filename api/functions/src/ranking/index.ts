import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

import * as cors from 'cors';
const corsHandler = cors({origin: true});

const aUserRank = async (req, res) => { // {{{
  let db = admin.firestore();
  let aRankRef = await db.doc('users/'+req.query.id);
  aRankRef.get().then(snapshot => {
    if (snapshot.exists) { // {{{
      let d = {};
      d = snapshot.data();
      d['updated'] = snapshot.updateTime;
      d['created']= snapshot.createTime;
      res.status(200).json({message: 'success', data: d, error: null});
    } else {
      res.status(404).json({message: 'not found', data: snapshot.data(), error: null});
    } // }}}
  }).catch((e) =>{
    console.log(e);
  });
} // }}}

const allRank = async (req, res) => { // {{{
  let db = admin.firestore();
  let allRef = await db.collection('users');
  let data = []
  allRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      let d = {}
      d = doc.data();
      d['updated'] = doc.updateTime;
      d['created'] = doc.createTime;
      data = data.concat(d);
    });
  }).then(() =>{
    res.status(200).json({message: 'success', data: data, error:null})
  });
} // }}}

const weekRank = async (req, res) => { // {{{
} // }}}

const monthRank = async (req, res) => { // {{{
} // }}}


const handleGET = async (req, res) => { // {{{
  // Do something with the GET request
  try{
    const query = req.query;
    let data = [];
    if (query) {
      switch (query.type) {
        case 'user':
          await aUserRank(req, res);
          break;
        case 'all':
          await allRank(req, res);
          break;
        case 'weelkly':
          await weekRank(req, res);
          break;
        case 'monthly':
          await monthRank(req, res);
          break;
        default:
          res.status(500).json({ message: 'invalid type', data: null, error: 500 });
          break;
      }
    }else{ // {{{
      let db = admin.firestore();
      db.collection('ranking').get()
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
    } // }}}
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', data: null, error: 500});
  }
} // }}}

const handlePUT = async (req, res) => { // {{{
  // Do something with the PUT request
  try{
    const idToken = req.body.idToken;
    let db = admin.firestore();
    // let aRankRef = await db.collection('ranking').get(idToken);
    let aRankRef = db.doc('ranking/'+idToken);
    let setRank = await aRankRef.update({
      schoolId: req.body.schoolId,
      idToken: req.body.idToken,
      rankingname: req.body.rankingname,
      max_count: req.body.max_count,
      now_count: req.body.now_count
    });
    res.status(200).json({message: 'success', error: null})
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', error: 500});
  }
} // }}}

const handlePOST = async (req, res) => { // {{{
  // Do something with the POST request
  try{
    const idToken = req.body.idToken;
    let db = admin.firestore();
    let aRankRef = await db.collection('ranking').doc(idToken);
    console.log(aRankRef, typeof(aRankRef))
    let setRank = await aRankRef.set({
      idToken: req.body.idToken,
      username: req.body.username,
      max_count: req.body.max_count,
      now_count: req.body.now_count
    });
    res.status(200).json({message: 'success', error: null})
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', error: 500});
  }
} // }}}

export const rankingController = functions.https.onRequest(async (req, res) => { // {{{
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
