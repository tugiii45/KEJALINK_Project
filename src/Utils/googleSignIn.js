import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

// Signs in using Google popup, then returns the Firestore user profile.
// Assumes Firestore users are stored at users/{uid} with at least { uid, role }.
export async function signInWithGoogle() {
  // Behave like "sign in straight with Google".
  // If the user doesn't have a Firestore profile yet, create a default one.
  const provider = new GoogleAuthProvider();

  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;

  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data();
  }

  const profileData = {
    uid: fbUser.uid,
    fullName: fbUser.displayName || '',
    email: fbUser.email || '',
    // Default role/house info for new Google users.
    // You can adjust these defaults to match your onboarding flow.
    role: 'Tenant',
    houseNumber: 'N/A',
    createdAt: new Date().toISOString(),
  };

  await setDoc(userDocRef, profileData);
  return profileData;
}


export async function ensureUserProfileForGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;

  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data();
  }

  // Fallback for future use: create a default profile if missing.
  const profileData = {
    uid: fbUser.uid,
    fullName: fbUser.displayName || '',
    email: fbUser.email || '',
    role: 'Tenant',
    houseNumber: 'N/A',
    createdAt: new Date().toISOString(),
  };

  await setDoc(userDocRef, profileData);
  return profileData;
}

