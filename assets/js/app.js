async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function renderList(container, items) {
  container.innerHTML = "";
  for (const it of items) {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div>
        <h3>${escapeHtml(it.name)}</h3>
        <p>${escapeHtml(it.description || "")}</p>
        <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
          ${(it.tags||[]).map(t => `<span class="badge ${badgeColor(t)}">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
        ${it.status ? `<span class="badge blue">${escapeHtml(it.status)}</span>` : ""}
        ${it.url ? `<a class="btn primary" href="${it.url}" target="_blank" rel="noreferrer">Open</a>` : ""}
      </div>
    `;
    container.appendChild(el);
  }
}

function badgeColor(tag) {
  const t = String(tag || "").toLowerCase();
  if (t.includes("game")) return "green";
  if (t.includes("tool")) return "blue";
  if (t.includes("member") || t.includes("subscriber")) return "pink";
  return "";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function wireSearch(inputSel, items, onFiltered) {
  const input = qs(inputSel);
  input?.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return onFiltered(items);
    const filtered = items.filter(it =>
      [it.name, it.description, ...(it.tags||[])].some(v => String(v||"").toLowerCase().includes(q))
    );
    onFiltered(filtered);
  });
}

window.Site = { loadJson, renderList, wireSearch, qs, qsa };
