import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7AJgBXdVsly3WpDQts-YwiGDr7KROFcg",
  authDomain: "gen-lang-client-0875324053.firebaseapp.com",
  projectId: "gen-lang-client-0875324053",
  storageBucket: "gen-lang-client-0875324053.firebasestorage.app",
  messagingSenderId: "491056580385",
  appId: "1:491056580385:web:81c0a606e14a78983ae060"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Test Firestore Connection as required by Firebase integration skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

export { app, auth, db };
