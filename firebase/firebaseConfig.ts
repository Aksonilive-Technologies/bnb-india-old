import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
// import admin from 'firebase-admin';

// Firebase client-side configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDMNcxObTeb1Qtx9uIIBFBYK6V9C2ZAulk",
//   authDomain: "text-auth123.firebaseapp.com",
//   projectId: "text-auth123",
//   storageBucket: "text-auth123.appspot.com",
//   messagingSenderId: "795681942637",
//   appId: "1:795681942637:web:f1103e99359b4c4d356364"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAwWdTzhBcwlOSwLSq2nSM_iWhuO7X0AMo",
  authDomain: "campus-assist-11dfe.firebaseapp.com",
  projectId: "campus-assist-11dfe",
  storageBucket: "campus-assist-11dfe.appspot.com",
  messagingSenderId: "728392121708",
  appId: "1:728392121708:web:e5b584663b85344577c749",
  measurementId: "G-2S4BWQHQZ6"
 };

// Initialize Firebase client-side if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);


export { auth, storage, db };
