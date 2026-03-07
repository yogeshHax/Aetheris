import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAJtlwoZ4QFqYbuAC5vZ2P2DRg3qkG3hAc",
    authDomain: "frosthack-3a460.firebaseapp.com",
    projectId: "frosthack-3a460",
    storageBucket: "frosthack-3a460.firebasestorage.app",
    messagingSenderId: "1015799518937",
    appId: "1:1015799518937:web:6950590704c499d900d0c8",
    measurementId: "G-WYDVJ26VYS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
