
/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for the KejaLink application:
 * - Firebase Authentication (for user login/signup)
 * - Cloud Firestore (for storing user profiles, payments, maintenance tickets, and notices)
 * 
 * The configuration values connect to the KejaLink Firebase project.
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration from the KejaLink console
const firebaseConfig = {
  apiKey: 'AIzaSyAAIXLw5rp7fjJLiPbZPiJgq4GmTLVRsNE',
  authDomain: "kejalink-fef99.firebaseapp.com",
  projectId: "kejalink-fef99",
  storageBucket: "kejalink-fef99.appspot.com",
   messagingSenderId: '603809577260',
   appId: '1:603809577260:web:5b82b5c708f5f4a6975489'
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Export Firebase services for use throughout the app
export const auth = getAuth(app);           // Used for user authentication (login/signup)
export const db = getFirestore(app);        // Used for data storage (Firestore database)