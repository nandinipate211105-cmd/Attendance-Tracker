document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll("table tr");

  rows.forEach(row => {
    const statusCell = row.cells[2]; // 3rd column (Present/Absent)

    if (statusCell) {
      const status = statusCell.textContent.trim().toLowerCase();

      if (status === "present") {
        statusCell.classList.add("present");
      } 
      else if (status === "absent") {
        statusCell.classList.add("absent");
      }
    }
  });

  // attendance percentage calculation
  const percent = (12 / 15 * 100).toFixed(1);
  document.getElementById("percent").textContent = percent + "%";
});
