import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Substitua pelos dados do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCwMlZf0HzSeuL65iWPQSsjyeyDQ7nmaW4",
  authDomain: "reactfirebase-356ad.firebaseapp.com",
  databaseURL: "https://reactfirebase-356ad-default-rtdb.firebaseio.com",
  projectId: "reactfirebase-356ad",
  storageBucket: "reactfirebase-356ad.firebasestorage.app",
  messagingSenderId: "987840618825",
  appId: "1:987840618825:web:b211a53defd4ed8a97fa98"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
