import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../configs/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const db = getFirestore(app);

export { auth, app, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, addDoc, setDoc, getDoc, doc, onAuthStateChanged }