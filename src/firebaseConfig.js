import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import necessary methods from Firebase Storage
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRz-ILgMA1mdp4q1BGU2pGHKQNuGclT9s",
  authDomain: "project1-6e2a1.firebaseapp.com",
  projectId: "project1-6e2a1",
  storageBucket: "project1-6e2a1.appspot.com",
  messagingSenderId: "896781567806",
  appId: "1:896781567806:web:755a8a876b8fb60341ce6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);   // Correct way to initialize storage in Firebase v9
const firestore = getFirestore(app);

export { firestore, storage };
