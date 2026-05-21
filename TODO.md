# TODO - Google Sign-In on Landing Page

## Plan
1. Inspect `src/Pages/LandingPage.jsx` and `kejalink/firebase.js` for current Firebase Auth setup.
2. Add Firebase Google Auth provider / popup sign-in code:
   - Use `GoogleAuthProvider` and `signInWithPopup` (or `signInWithRedirect`) from `firebase/auth`.
   - After successful sign-in, locate/create user profile in Firestore `users/{uid}`.
   - Dispatch Redux `loginSuccess(profile)`.
3. Add a **“Continue with Google”** button to `LandingPage.jsx` that triggers the Google sign-in flow.
4. Redirect user based on `profile.role` to the correct dashboard.
5. Verify that after login the sidebar shows (uses `AppRouter` + `auth.isAuthenticated`).

## Progress
- [x] Inspect required files.

- [x] Implement Firebase Google sign-in logic.

- [x] Add UI button to landing page.


- [ ] Test flow end-to-end.

