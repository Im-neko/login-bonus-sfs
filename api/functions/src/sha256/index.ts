import * as crypto from 'crypto'

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'


export const sha256Controller = functions.https.onRequest(async (req, res) => { // {{{
  res.set('Access-Control-Allow-Origin', "*");
  try{
    const text = req.body.text;
    let sha256 = crypto.createHash('sha256');
    sha256.update(text)
    const hash = sha256.digest('hex')
    res.status(200).json({message: 'success', data: hash, error: null})
  } catch(e) {
    res.status(500).json({message: 'Internal Server Error', data: null, error: 500});
  }
}); // }}}
