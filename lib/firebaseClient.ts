import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANutOa1nIu8Nr1B-wIs2M3HuQ5ub-B3Ow",
  authDomain: "axiomarket-e4e10.firebaseapp.com",
  projectId: "axiomarket-e4e10",
  storageBucket: "axiomarket-e4e10.appspot.com", // note: remove .firebasestorage.app typo
  messagingSenderId: "598484332433",
  appId: "1:598484332433:web:5c805218c60f2d60d1f430",
  measurementId: "G-E04L6PC1D4"
};

const app = initializeApp(firebaseConfig);

// Firestore client
export const db = getFirestore(app);