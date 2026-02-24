import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "focus-family-2026-v1",
  appId: "1:251128173856:web:f2c2f1edf2bf81bc1eb345",
  storageBucket: "focus-family-2026-v1.firebasestorage.app",
  apiKey: "AIzaSyBc95dxcEAtJ4VdkXICx1AhltxYPMOeILI",
  authDomain: "focus-family-2026-v1.firebaseapp.com",
  messagingSenderId: "251128173856"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
