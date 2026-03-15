// Replacing the Mock Database with the Actual Firebase Database on the Server using Client SDK
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDXCpm6XWHPY-hwZzXcsCBvrsRCKluaVdo",
  authDomain: "friendlydrop-e7cc6.firebaseapp.com",
  projectId: "friendlydrop-e7cc6",
  storageBucket: "friendlydrop-e7cc6.firebasestorage.app",
  messagingSenderId: "257454553848",
  appId: "1:257454553848:web:7ac07c32cd8ac431e2d90d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
