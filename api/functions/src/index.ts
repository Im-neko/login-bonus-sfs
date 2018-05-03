import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

import * as user from './user';
import * as ranking from './ranking';

admin.initializeApp(functions.config().firebase);

export const userapi = user.userController;
export const rankingapi = ranking.rankingController;
