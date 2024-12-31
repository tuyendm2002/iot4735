// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCznfUw5ldW2FICYTFIsFy_gUF93mF6NO8",
  authDomain: "bangtaivtp.firebaseapp.com",
  databaseURL: "https://bangtaivtp-default-rtdb.firebaseio.com",
  projectId: "bangtaivtp",
  storageBucket: "bangtaivtp.firebasestorage.app",
  messagingSenderId: "414181806205",
  appId: "1:414181806205:web:c5e518077ec1c049dee114",
  measurementId: "G-BM0J9PPNG7",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
