import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCecy1Mtcxq49XTk9MveePx2pirnCWpFSk",
  authDomain: "bnbservices-904ae.firebaseapp.com",
  projectId: "bnbservices-904ae",
  storageBucket: "bnbservices-904ae.firebasestorage.app",
  messagingSenderId: "867406591926",
  appId: "1:867406591926:web:1f978db2c9535568daf317",
  measurementId: "G-TWM5FXC472"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);