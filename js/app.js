const state = {
  moduleIndex: 0,
  query: ""
};

function $(sel, root = document) {
  return root.querySelector(sel);
}

function renderNav() {
  const nav = $("#nav");
  nav.innerHTML = NOTES.map((mod, i) => `
    <div class="nav-mod ${i === state.moduleIndex ? "open" : ""}" data-i="${i}">
      <button type="button" class="${i === state.moduleIndex ? "active" : ""}" data-open="${i}">
        ${mod.num} · ${mod.title}
      </button>
      <div class="topics">
        ${mod.topics.map((t, ti) => `
          <a href="#${t.id}" data-jump="${i}:${ti}">${t.title}</a>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function renderModule() {
  const q = state.query.trim().toLowerCase();
  if (q) {
    const hits = [];
    NOTES.forEach((mod, mi) => {
      mod.topics.forEach((t) => {
        if ((t.title + " " + t.body).toLowerCase().includes(q)) {
          hits.push({ mod, mi, t });
        }
      });
    });
    $("#content").innerHTML = `
      <section class="hero">
        <div class="kicker">Search</div>
        <h2>${hits.length} result(s) for “${q.replaceAll("<", "&lt;")}”</h2>
        <p>Poori notes mein search. Result pe click karke topic kholo.</p>
      </section>
      ${hits.map(({ mod, mi, t }) => `
        <article class="card">
          <h3 class="topic-title">${mod.num} · ${mod.title} → ${t.title}</h3>
          <button class="ghost" type="button" data-open="${mi}" data-hash="${t.id}">Open topic</button>
          <div>${t.body}</div>
        </article>
      `).join("") || `<div class="card">Kuch nahi mila. Doosra keyword try karo.</div>`}
    `;
    $("#crumb").textContent = `Search · ${hits.length}`;
    renderNav();
    return;
  }

  const mod = NOTES[state.moduleIndex];
  const topics = mod.topics;

  $("#content").innerHTML = `
    <section class="hero">
      <div class="kicker">BTech CSE · TypeScript Notes</div>
      <h2>${mod.num}. ${mod.title}</h2>
      <p>${mod.intro}</p>
    </section>
    ${topics.map((t) => `
      <article class="card">
        <h3 class="topic-title" id="${t.id}"><span class="badge">Topic</span> ${t.title}</h3>
        ${t.body}
      </article>
    `).join("") || `<div class="card">Is module mein search ka result nahi mila.</div>`}
    <div class="pager">
      <button type="button" id="prevBtn" ${state.moduleIndex === 0 ? "disabled" : ""}>← Previous module</button>
      <button type="button" id="nextBtn" ${state.moduleIndex === NOTES.length - 1 ? "disabled" : ""}>Next module →</button>
    </div>
  `;

  $("#crumb").textContent = `${mod.num} / ${NOTES.length} · ${mod.title}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderNav();
}

function go(i, hash) {
  state.moduleIndex = Math.max(0, Math.min(NOTES.length - 1, i));
  renderModule();
  if (hash) {
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 60);
  }
}

document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) {
    state.query = "";
    $("#search").value = "";
    go(Number(open.dataset.open), open.dataset.hash);
    $("#sidebar").classList.remove("open");
  }
  const jump = e.target.closest("[data-jump]");
  if (jump) {
    state.query = "";
    $("#search").value = "";
    const [mi] = jump.dataset.jump.split(":").map(Number);
    if (mi !== state.moduleIndex) go(mi);
    setTimeout(() => document.querySelector(jump.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" }), 50);
  }
  if (e.target.id === "prevBtn") go(state.moduleIndex - 1);
  if (e.target.id === "nextBtn") go(state.moduleIndex + 1);
  if (e.target.id === "menuBtn") $("#sidebar").classList.toggle("open");
  if (e.target.id === "themeBtn") {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ts-notes-theme", next);
  }
});

$("#search").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderModule();
});

document.documentElement.dataset.theme = localStorage.getItem("ts-notes-theme") || "dark";
renderModule();
