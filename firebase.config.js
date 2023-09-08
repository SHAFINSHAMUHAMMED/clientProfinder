
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBRDNvqwVFEFzKFs0IKRYu_-FQPfg9Nm8",
  authDomain: "profinder-otp.firebaseapp.com",
  projectId: "profinder-otp",
  storageBucket: "profinder-otp.appspot.com",
  messagingSenderId: "803548050102",
  appId: "1:803548050102:web:e9a15f368ce3a9206b6c17",
  measurementId: "G-DE2KV7R7GS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)