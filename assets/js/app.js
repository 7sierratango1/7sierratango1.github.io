// 7SierraTango1 Modern Site - List renderer (Tools/Games/3D/Audio)
function normalizePath(p) {
  if (!p) return "";
  // support both "/assets/..." and "assets/..." in JSON/HTML
  return String(p).replace(/^\//, "");
}

function esc(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadJson(path) {
  const res = await fetch(normalizePath(path), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.json();
}

function makeCard(it) {
  const banner = normalizePath(it.banner || "");
  const bannerStyle = banner
    ? `style="background-image:url('${banner}');"`
    : "";

  const buttonBg = normalizePath(it.buttonBg || "");
  const buttonStyle = buttonBg
    ? `style="background-image:url('${buttonBg}');"`
    : "";

  const tags = Array.isArray(it.tags) ? it.tags : [];
  const tagsHtml = tags.length
    ? `<div class="tags">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
    : "";

  const status = it.status ? `<span class="badge">${esc(it.status)}</span>` : "";

  return `
    <div class="tool-card">
      <div class="tool-banner" ${bannerStyle}></div>
      <div class="tool-body">
        <div class="tool-top">
          <h3 class="tool-title">${esc(it.name || "Untitled")}</h3>
          ${status}
        </div>
        <p class="tool-desc">${esc(it.description || "")}</p>
        ${tagsHtml}
        <div class="tool-actions">
          ${it.url ? `<a class="btn primary tool-btn" ${buttonStyle} href="${esc(it.url)}" target="_blank" rel="noreferrer">Open</a>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderList(container, items) {
  container.innerHTML = "";
  if (!items || !items.length) {
    container.innerHTML = `<div class="card"><p style="margin:0;">No items found.</p></div>`;
    return;
  }
  const frag = document.createDocumentFragment();
  for (const it of items) {
    const el = document.createElement("div");
    el.innerHTML = makeCard(it);
    frag.appendChild(el.firstElementChild);
  }
  container.appendChild(frag);
}

function wireSearch(input, items, onFiltered) {
  const all = Array.isArray(items) ? items : [];
  const handler = () => {
    const q = String(input.value || "").trim().toLowerCase();
    if (!q) return onFiltered(all);

    const filtered = all.filter(it => {
      const hay = [
        it.name,
        it.description,
        ...(Array.isArray(it.tags) ? it.tags : []),
        it.status
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });

    onFiltered(filtered);
  };

  input.addEventListener("input", handler);
  handler();
}

async function initListPage(jsonPath) {
  const q = document.getElementById("q");
  const list = document.getElementById("list");
  if (!list) return;

  try {
    const items = await loadJson(jsonPath);
    const all = Array.isArray(items) ? items : [];
    if (q) wireSearch(q, all, (filtered) => renderList(list, filtered));
    else renderList(list, all);
  } catch (e) {
    console.error(e);
    list.innerHTML = `<div class="card"><p style="margin:0;">Failed to load content.</p></div>`;
  }
}

// Auto-init based on page-provided data attribute (preferred)
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const path = root.getAttribute("data-json");
  if (path) initListPage(path);
});
