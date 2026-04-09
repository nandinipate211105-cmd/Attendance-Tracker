/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
  storageBucket: "attendance-4200d.firebasestorage.app",
  messagingSenderId: "845413522162",
  appId: "1:845413522162:web:11618866eddda641a58e6b",
  measurementId: "G-DCZY64PFJV"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const roleInput = document.querySelector('input[name="role"]:checked');
  if (!roleInput) {
    alert("Please select Student or Teacher");
    return;
  }

  const role = roleInput.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirm_password.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      fullname: form.fullname.value,
      roll_no: form.roll_no.value,
      prn_no: form.prn_no.value,
      class: form.class.value,
      division: form.division.value,
      branch: form.branch.value,
      gender: form.gender.value,
      dob: form.dob.value,
      phone: form.phone.value,
      email,
      role,
      createdAt: new Date()
    });

    alert("Registration Successful!");
    window.location.href = "login.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});*/









import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
  storageBucket: "attendance-4200d.firebasestorage.app",
  messagingSenderId: "845413522162",
  appId: "1:845413522162:web:11618866eddda641a58e6b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const roleInput = document.querySelector('input[name="role"]:checked');
  if (!roleInput) {
    alert("Please select Student or Teacher");
    return;
  }

  const role = roleInput.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirm_password.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    let userData = {
      fullname: form.fullname.value,
      email,
      role,
      gender: form.gender.value,
      dob: form.dob.value,
      phone: form.phone.value,
      createdAt: new Date()
    };

    if (role === "student") {
      userData.roll_no = form.roll_no.value;
      userData.prn_no = form.prn_no.value;
      userData.class = form.class.value;
      userData.division = form.division.value;
      userData.branch = form.branch.value;
    }

    if (role === "teacher") {
      userData.subject = form.subject.value;
      userData.post = form.post.value;
      userData.employee_no = form.employee_no.value;
    }

    await setDoc(doc(db, "users", uid), userData);

    alert("Registration Successful ✅");
    window.location.href = "login.html";

  } catch (err) {
    alert(err.message);
  }
});

