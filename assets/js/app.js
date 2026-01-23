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


let SITE_SETTINGS = null;

async function loadSiteSettings(){
  if (SITE_SETTINGS) return SITE_SETTINGS;
  try{
    SITE_SETTINGS = await loadJson("data/site-settings.json");
  }catch{
    SITE_SETTINGS = { defaults: { pageBackground: "assets/img/page-bg/default-bg.png", toolCardFallbackBanner:"assets/img/button-bg.png", toolButtonFallback:"assets/img/button-bg.png" }, pages: {}, toolImages: {} };
  }
  return SITE_SETTINGS;
}

function currentPageKey(){
  // Use the last path segment so this works on GitHub Pages project sites (/<repo>/page.html)
  const raw = (location.pathname || "").replace(/^\/+/, "");
  const seg = raw.split("/").filter(Boolean);
  const last = seg.length ? seg[seg.length-1] : "";
  if (last && last.endsWith(".html")) return last;
  return "index.html";
}

function applyPageBackground(settings){
  const key = currentPageKey();
  const bg = (settings.pages && settings.pages[key] && settings.pages[key].background) || (settings.defaults && settings.defaults.pageBackground) || "assets/img/page-bg/default-bg.png";
  document.body.classList.add("page-bg-set");
  const bgRel = String(bg || "").replace(/^\/+/, "");
  document.body.style.backgroundImage = `url("${bgRel}")`;
}

function getToolOverrides(settings, toolName){
  const m = (settings.toolImages || {});
  return m[toolName] || null;
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
  const isExternal = it.url ? /^(?:https?:)?\/\//i.test(it.url) : false;
  const linkAttrs = isExternal ? `target="_blank" rel="noreferrer"` : "";

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
          ${it.url ? `<a class="btn primary tool-btn" ${buttonStyle} href="${esc(it.url)}" ${linkAttrs}>Open</a>` : ""}
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
document.addEventListener("DOMContentLoaded", async () => {
  const settings = await loadSiteSettings();
  applyPageBackground(settings);
  const root = document.documentElement;
  const path = root.getAttribute("data-json");
  if (path) initListPage(path);
});
