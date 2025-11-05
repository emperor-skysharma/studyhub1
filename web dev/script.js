// ----------------------------
// KNIT Freshers Hub Script
// ----------------------------
const grid = document.getElementById("grid");
const tpl = document.getElementById("cardTpl");
const empty = document.getElementById("empty");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginNotice = document.getElementById("loginNotice");

// Filter elements
const searchInput = document.getElementById("search");
const deptFilter = document.getElementById("deptFilter");
const semFilter = document.getElementById("semFilter");
const clearBtn = document.getElementById("clear");

// Load existing user data
let resources = JSON.parse(localStorage.getItem("resources") || "[]");
const users = JSON.parse(localStorage.getItem("users") || "{}");
const loggedInEmail = localStorage.getItem("loggedIn");
const currentUser = loggedInEmail ? users[loggedInEmail] : null;

// ----------------------------
// DUMMY DATA (always visible)
// ----------------------------
const dummyData = [
  { title: "C Programming Notes", type: "notes", dept: "CSE", sem: "1", url: "https://example.com/c-programming.pdf", uploader: "Admin" },
  { title: "Python Basics Notes", type: "notes", dept: "CSE", sem: "2", url: "https://example.com/python-notes.pdf", uploader: "Admin" },
  { title: "Engineering Mechanics Paper 2023", type: "papers", dept: "ME", sem: "2", url: "https://example.com/mechanics.pdf", uploader: "Admin" },
  { title: "Fluid Mechanics Project", type: "projects", dept: "CE", sem: "4", url: "https://example.com/fluid-mech.pdf", uploader: "Admin" },
  { title: "Digital Electronics Lab Manual", type: "guides", dept: "ECE", sem: "3", url: "https://example.com/digital-lab.pdf", uploader: "Admin" },
  { title: "Signal Processing Notes", type: "notes", dept: "ECE", sem: "5", url: "https://example.com/signal-processing.pdf", uploader: "Admin" },
  { title: "Thermodynamics Notes", type: "notes", dept: "ME", sem: "3", url: "https://example.com/thermo.pdf", uploader: "Admin" },
  { title: "Structural Analysis Guide", type: "guides", dept: "CE", sem: "6", url: "https://example.com/structural-guide.pdf", uploader: "Admin" },
 
];

// Merge dummy + user data, avoiding duplicates
resources = [
  ...dummyData,
  ...resources.filter((r) => !dummyData.some((d) => d.title === r.title)),
];

// ----------------------------
// Render Resources
// ----------------------------
function render(list = resources) {
  grid.innerHTML = "";
  if (!list.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach((r, i) => {
    const c = tpl.content.cloneNode(true);
    c.querySelector(".meta").textContent = `${r.dept} • Sem ${r.sem} • ${r.type}`;
    c.querySelector(".title").textContent = r.title;
    c.querySelector(".desc").textContent = "By " + r.uploader;
    c.querySelector(".btn").href = r.url;

    const del = c.querySelector(".deleteBtn");
    if (currentUser && currentUser.name === r.uploader) {
      del.style.display = "inline-block";
      del.onclick = () => {
        resources.splice(i, 1);
        localStorage.setItem("resources", JSON.stringify(resources));
        applyFilters(); // re-filter after delete
      };
    }

    grid.appendChild(c);
  });
}
render();

// ----------------------------
// Filter Logic (Search + Dropdowns)
// ----------------------------
function applyFilters() {
  const keyword = searchInput.value.toLowerCase();
  const dept = deptFilter.value;
  const sem = semFilter.value;

  const filtered = resources.filter((r) => {
    const matchKeyword = r.title.toLowerCase().includes(keyword);
    const matchDept = dept === "all" || r.dept === dept;
    const matchSem = sem === "all" || r.sem === sem;
    return matchKeyword && matchDept && matchSem;
  });

  render(filtered);
}

// Event listeners for filters
searchInput.addEventListener("input", applyFilters);
deptFilter.addEventListener("change", applyFilters);
semFilter.addEventListener("change", applyFilters);
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  deptFilter.value = "all";
  semFilter.value = "all";
  render(resources);
});

// ----------------------------
// Login/Logout handling
// ----------------------------
if (currentUser) {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("signupBtn").style.display = "none";
  logoutBtn.style.display = "inline";
  loginNotice.style.display = "none";
} else {
  logoutBtn.style.display = "none";
  loginNotice.style.display = "block";
}

// Logout
if (logoutBtn)
  logoutBtn.onclick = () => {
    localStorage.removeItem("loggedIn");
    window.location.reload();
  };

// ----------------------------
// Add Resource (for logged-in users)
// ----------------------------
if (addBtn)
  addBtn.onclick = () => {
    if (!currentUser) return alert("You must be logged in to upload.");

    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value;
    const dept = document.getElementById("dept").value;
    const sem = document.getElementById("sem").value;
    const url = document.getElementById("url").value.trim();

    if (!title || !url) return alert("Please fill in all required fields!");
    const uploader = currentUser.name;

    resources.push({ title, type, dept, sem, url, uploader });
    localStorage.setItem("resources", JSON.stringify(resources));
    applyFilters();
    alert("Uploaded successfully!");
  };

// Reset upload form
if (resetBtn)
  resetBtn.onclick = () =>
    ["title", "url"].forEach((id) => (document.getElementById(id).value = ""));
