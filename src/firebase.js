import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSyAgW5Aqqnx8nN6-7hAOFhQO8K2-UTRYDd8",
    authDomain: "focuscraft-9693e.firebaseapp.com",
    databaseURL: "https://focuscraft-9693e-default-rtdb.firebaseio.com",
    projectId: "focuscraft-9693e",
    storageBucket: "focuscraft-9693e.firebasestorage.app",
    messagingSenderId: "393976628205",
    appId: "1:393976628205:web:18db41e35ed2a2bc381de4",
    measurementId: "G-4YRYKM6D11"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export { ref, set, push, onValue, update, remove };
