// src/components/Login.js
import React from 'react';
import { auth, GoogleAuthProvider, signInWithPopup, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      }, { merge: true }); // Merge so we don't overwrite any existing data

    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to the Chat App</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
