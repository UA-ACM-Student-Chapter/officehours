import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const cors = require('cors')({origin: true});

export const helloWorld = functions.https.onRequest((request, response) => {
 cors(request, response, () => {
     response.send({"message": "Hello there!"});
 })
});

export const userAdded = functions
    .auth
    .user().onCreate((user, context) => {
        const userRef = db.doc(`users/${user.uid}`);

        return userRef.set({
            name: user.email,
            uid: user.uid,
            dateCreated: context.timestamp
        });
    });