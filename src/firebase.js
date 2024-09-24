// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5uSA1aCGBziVSlOJUMJEGv8Qxuh1AKRU",
  authDomain: "all-in-one-001.firebaseapp.com",
  projectId: "all-in-one-001",
  storageBucket: "all-in-one-001.appspot.com",
  messagingSenderId: "420414355920",
  appId: "1:420414355920:web:fa865581ed99492f5b61d5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, GoogleAuthProvider, signInWithPopup };
