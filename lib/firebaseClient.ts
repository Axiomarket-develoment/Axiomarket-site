import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCrF4NYnNN-ds-zok_itQQYHuY94JQ5YU",
  authDomain: "axiomarket20.firebaseapp.com",
  projectId: "axiomarket20",
  storageBucket: "axiomarket20.firebasestorage.app",
  messagingSenderId: "931549769527",
  appId: "1:931549769527:web:c5cd7dd6045ef9a72af4b2",
  measurementId: "G-NC008CYWDL"
};

const app = initializeApp(firebaseConfig);

// Firestore client
export const db = getFirestore(app);