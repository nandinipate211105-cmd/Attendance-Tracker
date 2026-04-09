/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ AddAttendance.js loaded");

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
  storageBucket: "attendance-4200d.appspot.com",
  messagingSenderId: "845413522162",
  appId: "1:845413522162:web:8cc6be984170f005a58e6b"
};

// 🔹 Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Load Students
async function loadStudents() {
  const studentsDiv = document.getElementById("studentsList");

  if (!studentsDiv) {
    console.error("❌ studentsList div not found");
    return;
  }

  studentsDiv.innerHTML = "Loading students...";

  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snapshot = await getDocs(q);

    console.log("📄 Students found:", snapshot.size);

    if (snapshot.empty) {
      studentsDiv.innerHTML = "No students found";
      return;
    }

    studentsDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      const label = document.createElement("label");
      label.className = "student-item";
      label.innerHTML = `
        <input type="checkbox" value="${doc.id}">
        ${data.fullname || "Unnamed Student"}
      `;

      studentsDiv.appendChild(label);
    });

  } catch (error) {
    console.error("🔥 Firestore Error:", error);
    studentsDiv.innerHTML = "Error loading students";
  }
}

loadStudents();

// 🔹 Back button
window.goBack = () => {
  window.location.href = "Teacher.html";
};*/












import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ AddAttendance.js loaded");

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
  storageBucket: "attendance-4200d.appspot.com",
  messagingSenderId: "845413522162",
  appId: "1:845413522162:web:8cc6be984170f005a58e6b"
};

// 🔹 Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Globals
const studentsDiv = document.getElementById("studentsList");
const saveBtn = document.getElementById("saveAttendanceBtn");

let selectedStudents = new Set(); // ⭐ IMPORTANT

// 🔹 Load Students
async function loadStudents() {
  studentsDiv.innerHTML = "Loading students...";

  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      studentsDiv.innerHTML = "No students found";
      return;
    }

    studentsDiv.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      const label = document.createElement("label");
      label.className = "student-item";

      label.innerHTML = `
        <input type="checkbox" value="${docSnap.id}">
        ${data.fullname || "Unnamed Student"}
      `;

      const checkbox = label.querySelector("input");

      // ✅ TRACK SELECTION
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedStudents.add(docSnap.id);
        } else {
          selectedStudents.delete(docSnap.id);
        }

        console.log("🟢 Selected students:", [...selectedStudents]);
      });

      studentsDiv.appendChild(label);
    });

  } catch (error) {
    console.error("🔥 Firestore Error:", error);
    studentsDiv.innerHTML = "Error loading students";
  }
}

loadStudents();

// 🔹 SAVE ATTENDANCE
saveBtn.addEventListener("click", async () => {
  const subject = document.getElementById("subject").value;
  const date = document.getElementById("date").value;
  const topic = document.getElementById("topic").value;

  if (!subject || !date || !topic) {
    alert("❌ Please fill all fields");
    return;
  }

  if (selectedStudents.size === 0) {
    alert("❌ Select at least one student");
    return;
  }

  const attendanceData = {
    subject,
    date,
    topic,
    presentStudents: [...selectedStudents],
    createdAt: new Date()
  };

  console.log("✅ Saving attendance:", attendanceData);

  try {
    await addDoc(collection(db, "attendance"), attendanceData);
    alert("✅ Attendance saved successfully");

    // Reset
    selectedStudents.clear();
    document.querySelectorAll(".student-item input").forEach(cb => cb.checked = false);

  } catch (err) {
    console.error("🔥 Save error:", err);
    alert("❌ Failed to save attendance");
  }
});

// 🔹 Back button
window.goBack = () => {
window.location.href = "./Teacher.html";
};
