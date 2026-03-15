import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Configured with the user's explicit real Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyDXCpm6XWHPY-hwZzXcsCBvrsRCKluaVdo",
  authDomain: "friendlydrop-e7cc6.firebaseapp.com",
  projectId: "friendlydrop-e7cc6",
  storageBucket: "friendlydrop-e7cc6.firebasestorage.app",
  messagingSenderId: "257454553848",
  appId: "1:257454553848:web:7ac07c32cd8ac431e2d90d",
  measurementId: "G-GX1BCYSFSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is optional and usually requires extra setup, keeping commented for now
// export const analytics = getAnalytics(app);
