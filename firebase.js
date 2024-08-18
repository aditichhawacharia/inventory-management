// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}  from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAoOSLEXQR80E1OVq5pSyg1hrGE0mlsiM",
  authDomain: "inventory-management-e4b60.firebaseapp.com",
  projectId: "inventory-management-e4b60",
  storageBucket: "inventory-management-e4b60.appspot.com",
  messagingSenderId: "583214142030",
  appId: "1:583214142030:web:73245ea22a89cbeb72a91f",
  measurementId: "G-CRPGPQNGB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore}

