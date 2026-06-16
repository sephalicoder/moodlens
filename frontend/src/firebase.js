import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC76LY0Fp1OG8eIxLVIg-qLo0UzIWxjonc",
  authDomain: "mood-lens-69d3b.firebaseapp.com",
  projectId: "mood-lens-69d3b",
  storageBucket: "mood-lens-69d3b.firebasestorage.app",
  messagingSenderId: "190163416138",
  appId: "1:190163416138:web:ccc06e49a70e405168e2b3"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)