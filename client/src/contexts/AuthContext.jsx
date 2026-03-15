import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Phone Auth Variables
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  // Define Recaptcha on mount to attach it securely to DOM element id "recaptcha-container"
  function setupRecaptcha(containerId) {
     if(!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
           size: 'invisible',
           callback: () => {
             console.log("Recaptcha resolved");
           }
        });
     }
  }

  async function sendPhoneOtp(phoneNumber, containerId) {
     setupRecaptcha(containerId);
     const appVerifier = window.recaptchaVerifier;
     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
     window.confirmationResult = confirmationResult;
     return confirmationResult;
  }

  async function verifyPhoneOtp(otp) {
     const result = await window.confirmationResult.confirm(otp);
     const user = result.user;
     
     // Fetch their role. If they don't have one, default to 'driver' for demo
     const docRef = doc(db, 'Users', user.uid);
     const docSnap = await getDoc(docRef);
     
     if(docSnap.exists()) {
       setUserRole(docSnap.data().role);
     } else {
       // Registration bypass for pure OTP users (Assumes Ambulance Driver for mobile logins if strict admin hasn't created)
       await setDoc(docRef, { phone: user.phoneNumber, role: 'driver', createdAt: new Date() });
       setUserRole('driver');
     }
     
     return result;
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, 'Users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserRole(data.role);
      return { user, role: data.role };
    } else {
      throw new Error("User document does not exist in Firestore! Contact Admin.");
    }
  }

  async function register(email, password, role) {
    // Creates the user inside Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Stores their individual role inside the Firebase Database
    await setDoc(doc(db, 'Users', user.uid), {
      email,
      role: role,
      createdAt: new Date()
    });

    setUserRole(role);
    return { user, role };
  }

  function logout() {
    setUserRole(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
           const docRef = doc(db, 'Users', user.uid);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
              setUserRole(docSnap.data().role);
           }
        } catch (e) {
           console.error("Error fetching role on refresh:", e);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    register,
    sendPhoneOtp,
    verifyPhoneOtp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
