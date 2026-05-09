import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAINO1tPadtgGhlrGbBB3F59NjiDVMbo44",
  authDomain: "dragonfly-scanner-73991.firebaseapp.com",
  projectId: "dragonfly-scanner-73991",
  storageBucket: "dragonfly-scanner-73991.firebasestorage.app",
  messagingSenderId: "1007028518380",
  appId: "1:1007028518380:web:ff9dd92f2ec11b3a6d54c9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
