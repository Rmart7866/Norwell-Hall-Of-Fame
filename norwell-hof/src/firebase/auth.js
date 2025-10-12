// src/firebase/auth.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
  } from 'firebase/auth';
  import { auth } from './config';
  
  // Sign up new user
  export const signUpUser = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign in existing user
  export const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign out current user
  export const signOutUser = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Listen for auth state changes
  export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Get current user
  export const getCurrentUser = () => {
    return auth.currentUser;
  };