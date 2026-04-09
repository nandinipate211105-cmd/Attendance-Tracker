// ----------------------------
// FIREBASE BACKEND
// ----------------------------

// Firebase Imports (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
  storageBucket: "attendance-4200d.appspot.com",
  messagingSenderId: "845413522162",
  appId: "1:845413522162:web:8cc6be984170f005a58e6b"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ----------------------------
// LOGIN FUNCTION
// ----------------------------
async function loginUser(selectedRole, email, password) {
  try {
    // Auth login
    const userCredential =
      await signInWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    // 🔥 Get user from USERS collection
    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      alert("User data not found");
      return;
    }

    const userData = userDoc.data();

    // 🔥 Role check (CASE SAFE)
    if (userData.role !== selectedRole.toLowerCase()) {
      alert("Login failed: Role mismatch");
      return;
    }

    // ✅ Success
    alert("Login successful");

    // Role-based redirect
    if (selectedRole === "student") {
      window.location.href = "main.html";
    } else {
      window.location.href = "Teacher.html";
    }

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
}

// ----------------------------
// FORM SUBMIT
// ----------------------------
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const role = loginForm.role.value.toLowerCase();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  if (!role || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  loginUser(role, email, password);
});

