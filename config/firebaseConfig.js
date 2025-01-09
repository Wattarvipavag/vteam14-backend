import { keys } from './serviceAccountKey.js';
import admin from 'firebase-admin';

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(keys),
});

export default firebaseApp;
