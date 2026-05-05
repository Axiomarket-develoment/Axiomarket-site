import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOTNrOHPRkMHa6SXDmwYJeoMLgopnNAdE",
  authDomain: "axiomarket30.firebaseapp.com",
  projectId: "axiomarket30",
  storageBucket: "axiomarket30.firebasestorage.app",
  messagingSenderId: "144355827167",
  appId: "1:144355827167:web:fd535b48edd6eaffc3f86a",
  measurementId: "G-NBRXJCQKBY"
};

const app = initializeApp(firebaseConfig);

// Firestore client
export const db = getFirestore(app);