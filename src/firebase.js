import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "focuscraft-...",
    databaseURL: "https://focuscraft-...",
    projectId: "focuscraft-...",
    storageBucket: "focuscraft-...",
    messagingSenderId: "3939766...",
    appId: "1:3939766...de4",
    measurementId: "G-4YRYK..."
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export { ref, set, push, onValue, update, remove };
