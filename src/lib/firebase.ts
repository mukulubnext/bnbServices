import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAD9aKZ1I02DEAlbuBiEizdPtwoV4Nnaec",
  authDomain: "bnbservices-600a1.firebaseapp.com",
  projectId: "bnbservices-600a1",
  storageBucket: "bnbservices-600a1.firebasestorage.app",
  messagingSenderId: "704488998770",
  appId: "1:704488998770:web:1d5566f8199b31be027feb"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);