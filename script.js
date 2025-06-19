import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Your Firebase Config (Replace if needed)
const firebaseConfig = {
  apiKey: "AIzaSyA3xc9pBhTlcgf121qynj2aGOKSSNg_epw",
  authDomain: "chatbook-4u.firebaseapp.com",
  projectId: "chatbook-4u",
  storageBucket: "chatbook-4u.appspot.com",
  messagingSenderId: "649325779586",
  appId: "1:649325779586:web:916146e3b9b6c1959ff29b"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ Google Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert("Login failed: " + error.message);
    console.error("Login Error:", error);
  }
});

// ✅ Check Login Status
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, snapshot => {
      const messagesDiv = document.getElementById("messages");
      messagesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const div = document.createElement("div");
        div.textContent = `${msg.name}: ${msg.text}`;
        messagesDiv.appendChild(div);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
  }
});

// ✅ Send Message
document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("messageInput");
  const user = auth.currentUser;
  const text = input.value.trim();

  if (text && user) {
    await addDoc(collection(db, "messages"), {
      name: user.displayName,
      text: text,
      timestamp: serverTimestamp()
    });
    input.value = "";
  }
});
