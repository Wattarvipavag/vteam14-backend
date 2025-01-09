import { keys } from './serviceAccountKey.js';
import admin from 'firebase-admin';

let firebaseApp;

if (process.env.NODE_ENV !== 'test') {
    firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(keys),
    });
}
export default firebaseApp;
