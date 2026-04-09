import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {getFirestore,collection,getDocs,doc,getDoc} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCV5Sq3B09F4-o38lHMt7mhB5e5_dEo0BA",
  authDomain: "attendance-4200d.firebaseapp.com",
  projectId: "attendance-4200d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const subjectsGrid = document.getElementById("subjectsGrid");
const modal = document.getElementById("subjectModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalTableBody");
const closeBtn = document.querySelector(".close");

const SUBJECTS = ["CHEMISTRY", "DTIL", "MATHS", "EGA", "PIC", "FCE", "IKS", "LS", "EVENTS"];

// Load Subject Cards
async function loadSubjects() {
  const attendanceSnap = await getDocs(collection(db, "attendance"));

  let subjectStats = {};

  SUBJECTS.forEach(s => {
    subjectStats[s] = { totalPercent: 0, count: 0 };
  });

  attendanceSnap.forEach(docSnap => {
    const data = docSnap.data();
    SUBJECTS.forEach(sub => {
      if (data[sub]) {
        subjectStats[sub].totalPercent += Number(data[sub].percent);
        subjectStats[sub].count++;
      }
    });
  });

  SUBJECTS.forEach(sub => {
    const avg =
      subjectStats[sub].count === 0
        ? 0
        : (subjectStats[sub].totalPercent / subjectStats[sub].count).toFixed(1);

    subjectsGrid.innerHTML += `
      <div class="subject-card" onclick="openSubject('${sub}')">
        <h3>${sub}</h3>
        <p>📊 Avg Attendance: ${avg}%</p>
        <p>👨‍🎓 Students: ${subjectStats[sub].count}</p>
      </div>
    `;
  });
}

window.openSubject = async function (subject) {
  modal.style.display = "block";
  modalTitle.innerText = subject;
  modalBody.innerHTML = "";

  const attendanceSnap = await getDocs(collection(db, "attendance"));

  for (const docSnap of attendanceSnap.docs) {
    const uid = docSnap.id;
    const data = docSnap.data();
    if (!data[subject]) continue;

    const userSnap = await getDoc(doc(db, "users", uid));
    if (!userSnap.exists()) continue;

    const user = userSnap.data();
    if (user.role !== "student") continue;

    modalBody.innerHTML += `
      <tr>
        <td>${user.fullname}</td>
        <td>${data[subject].attended}</td>
        <td>${data[subject].total}</td>
        <td>${data[subject].percent}%</td>
      </tr>
    `;
  }
};

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

loadSubjects();



// 3D tilt effect
/*document.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".subject-card").forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform =
      `rotateX(${y / 20}deg) rotateY(${x / 20}deg) translateY(-10px)`;
  });
});

// Reset on mouse leave
document.addEventListener("mouseleave", () => {
  document.querySelectorAll(".subject-card").forEach(card => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});*/

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const auth = getAuth();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html"; // 🔁 redirect to login page
  } catch (error) {
    console.error("Logout error:", error);
    alert("Error logging out");
  }
});

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});


// Redirect to Add Attendance page
window.goToAddAttendance = function () {
  window.location.href = "AddAttendance.html";
};


window.addEventListener("load", () => {
  const btn = document.getElementById("addAttendanceBtn");

  // Delay until subject cards finish rendering
  setTimeout(() => {
    btn.classList.add("show");
  }, 700); // smooth & natural
});
