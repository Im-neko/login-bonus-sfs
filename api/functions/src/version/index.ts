import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

import * as cors from 'cors';
const corsHandler = cors({origin: true});


const handleGET = async (req, res) => { // {{{
  // Do something with the GET request
  try{
    let db = admin.firestore();

    let data = [];
      let VersionRef = await db.doc('version/latest');
      VersionRef.get().then((snapshot) => {
        if (snapshot.exists) {
          let d = {};
          d = snapshot.data();
          res.status(200).json({message: 'success', data: d, error: null});
        }else{
          res.status(404).json({message: 'not found', data: null, error: 404});
        }
      }).catch((e) => {
        res.status(500).json({message: 'DBError', data: null, error: 500});
      });
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', error: 500});
  }
}// }}}

const handlePOST = async (req, res) => { // {{{
  // Do something with the POST request
  try{
    const schoolId = req.body.schoolId;
    let db = admin.firestore();
    let VersionRef =  await db.doc('version/latest');
    let setVersion = await VersionRef.set({ // {{{
      version: req.body.version
    }); // }}}
    res.status(200).json({message: 'success', error: null})
  } catch(e) {
    console.log(req.body)
    console.error(e)
    res.status(500).json({message: 'Internal Server Error', error: 500});
  }
} // }}}

export const versionController = functions.https.onRequest(async (req, res) => { // {{{
  corsHandler(req, res, async () => {
    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
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
