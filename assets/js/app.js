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
    el.className = "item tool-card";

    const bannerUrl = it.banner || "/assets/img/button-bg.png";
    const safeBanner = String(bannerUrl).replace(/"/g, "&quot;");

    el.innerHTML = `
      <div class="tool-banner" style="background-image:url('${safeBanner}')">
        <div class="tool-banner-overlay">
          <h3 class="tool-title">${escapeHtml(it.name)}</h3>
          ${it.status ? `<span class="badge blue tool-status">${escapeHtml(it.status)}</span>` : ""}
        </div>
      </div>

      <div class="tool-body">
        <p class="tool-desc">${escapeHtml(it.description || "")}</p>

        <div class="tool-tags">
          ${(it.tags||[]).map(t => `<span class="badge ${badgeColor(t)}">${escapeHtml(t)}</span>`).join("")}
        </div>

        <div class="tool-actions">
          ${it.url ? `<a class="btn primary" href="${it.url}" target="_blank" rel="noreferrer">Open</a>` : ""}
        </div>
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
