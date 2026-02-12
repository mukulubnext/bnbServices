// Firebase Admin Configuration
// Kindly add your Firebase Admin configuration json in .env file as shown in .env.example

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)
    ),
  });
}

export default admin;