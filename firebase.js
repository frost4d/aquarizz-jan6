import * as firebase from "firebase/compat/app";
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4IICM-BTOhbcbRteWnyZIqc8b61zvmpY",
  authDomain: "aquarizz-9687c.firebaseapp.com",
  projectId: "aquarizz-9687c",
  storageBucket: "aquarizz-9687c.appspot.com",
  messagingSenderId: "876015324611",
  appId: "1:876015324611:web:5475e022b55d50feea0176"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const firebase_db = getFirestore(app)
export const firebase_auth = getAuth(app)

