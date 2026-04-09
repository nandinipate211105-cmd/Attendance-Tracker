// --------------------
// Firebase Imports
// --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// --------------------
// Firebase Config
// --------------------
const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
  storageBucket: "attendance-4200d.appspot.com",
  messagingSenderId: "845413522162",
  appId: "1:845413522162:web:8cc6be984170f005a58e6b"
};

// --------------------
// Initialize Firebase
// --------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --------------------
// CALCULATE ATTENDANCE
// --------------------
function calculateAttendance() {
  const rows = document.querySelectorAll("#attendanceTable tr");
  let totalAttended = 0;
  let totalClasses = 0;

  rows.forEach(row => {
    const totalInput = row.querySelector(".total");
    const attendedInput = row.querySelector(".attended");
    const percentCell = row.querySelector(".percent");

    if (!totalInput || !attendedInput || !percentCell) return;

    const total = Number(totalInput.value) || 0;
    const attended = Number(attendedInput.value) || 0;

    const percent =
      total > 0 ? ((attended / total) * 100).toFixed(2) : "0.00";

    percentCell.textContent = percent + "%";

    totalAttended += attended;
    totalClasses += total;
  });

  const overallPercent =
    totalClasses > 0
      ? ((totalAttended / totalClasses) * 100).toFixed(2)
      : "0.00";

  document.getElementById("totalAttended").textContent = totalAttended;
  document.getElementById("overallPercent").textContent = overallPercent + "%";

  saveAttendance();
}

// --------------------
// SAVE ATTENDANCE TO FIRESTORE
// --------------------

async function loadAttendance(uid) {
  const attendanceRef = doc(db, "attendance", uid);
  const snap = await getDoc(attendanceRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const rows = document.querySelectorAll("#attendanceTable tr");

  rows.forEach(row => {
    const subject = row.querySelector("h3 a")?.textContent;
    if (!subject || !data[subject]) return;

    row.querySelector(".total").value = data[subject].total;
    row.querySelector(".attended").value = data[subject].attended;
    row.querySelector(".percent").textContent =
      data[subject].percent + "%";
  });

  document.getElementById("overallPercent").innerText =
    data.overallAttendance + "%";
}

async function saveAttendance() {
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in ❌");
    return;
  }

  const rows = document.querySelectorAll("#attendanceTable tr");
  let attendanceData = {};
  let totalAttended = 0;
  let totalClasses = 0;

  rows.forEach(row => {
    const subject =
      row.querySelector("h3 a")?.textContent ||
      row.querySelector("select")?.value;

    if (!subject) return;

    const total = Number(row.querySelector(".total")?.value) || 0;
    const attended = Number(row.querySelector(".attended")?.value) || 0;

    const percent =
      total > 0 ? ((attended / total) * 100).toFixed(2) : "0.00";

    attendanceData[subject] = {
      total,
      attended,
      percent
    };

    totalAttended += attended;
    totalClasses += total;
  });

  attendanceData.overallAttendance =
    totalClasses > 0
      ? ((totalAttended / totalClasses) * 100).toFixed(2)
      : "0.00";

  attendanceData.updatedAt = new Date();

  try {
    await setDoc(doc(db, "attendance", user.uid), attendanceData);
    alert("Attendance saved successfully ✅");
  } catch (error) {
    console.error("Firestore error:", error);
    alert("Error saving attendance ❌");
  }
}

window.calculateAttendance = calculateAttendance;


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  await loadStudentData(user.uid);
  await loadAttendance(user.uid);
});

async function loadStudentData(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("No data found!");
    return;
  }

  const data = snap.data();

  // Role protection
  if (data.role !== "student") {
    window.location.href = "Teacher.html";
    return;
  }

  // show on page
  document.getElementById("name").innerText = data.fullname;
  document.getElementById("roll").innerText = "F-" + data.roll_no;
}


import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.logoutUser = async function () {
  try {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
};


