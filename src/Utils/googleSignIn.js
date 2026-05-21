import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

// Signs in using Google popup, then returns the Firestore user profile.
// Assumes Firestore users are stored at users/{uid} with at least { uid, role }.
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  // Optional: if you want to restrict to specific accounts/scopes, configure provider here.
  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;

  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  // Option 1 (configured): map to existing profile only.
  if (!userDocSnap.exists()) {
    throw new Error(
      'No account profile found for this Google user. Please use Sign Up / create your ledger profile first.'
    );
  }

  return userDocSnap.data();
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

