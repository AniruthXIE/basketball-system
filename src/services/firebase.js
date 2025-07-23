import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQBqC39WYL4qcGGqFOs4famm2YL6AN3p8",
  authDomain: "basketball-queue-a254e.firebaseapp.com",
  databaseURL: "https://basketball-queue-a254e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "basketball-queue-a254e",
  storageBucket: "basketball-queue-a254e.firebasestorage.app",
  messagingSenderId: "578047247701",
  appId: "1:578047247701:web:b4901b5cc9d493e2c95bdc",
  measurementId: "G-GGNPCVK2Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app;