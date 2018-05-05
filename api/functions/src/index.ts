import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

import * as user from './user';
import * as ranking from './ranking';
import * as sha256 from './sha256';


admin.initializeApp(functions.config().firebase);

export const userapi = user.userController;
export const rankingapi = ranking.rankingController;
export const sha256api = sha256.sha256Controller;
