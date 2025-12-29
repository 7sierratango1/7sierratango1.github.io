/**
 * Members gate (client-side) demo.
 * IMPORTANT: Client-only gating is NOT secure. Use a backend token check for real subscriber access.
 *
 * This file is a starter that expects you to deploy a tiny backend endpoint:
 *   POST /api/twitch/verify
 *   body: { "access_token": "..." }
 *   returns: { "ok": true, "is_subscriber": true, "display_name": "..." }
 */
const CONFIG = {
  VERIFY_ENDPOINT: "/api/twitch/verify", // change after you deploy your Worker/Firebase function
};

function saveSession(session) {
  localStorage.setItem("st1_session", JSON.stringify(session));
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem("st1_session") || "null"); } catch { return null; }
}
function clearSession() {
  localStorage.removeItem("st1_session");
}

async function verify(accessToken) {
  const res = await fetch(CONFIG.VERIFY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken })
  });
  if (!res.ok) throw new Error(`Verify failed: ${res.status}`);
  return res.json();
}

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg;
}

async function handleLogin() {
  // This is a placeholder: you’ll start the OAuth flow on your backend (recommended) or via Twitch Implicit Grant.
  setStatus("Login flow placeholder. See README for Twitch OAuth + subscriber verification setup.");
}

function requireSubscriber() {
  const session = loadSession();
  if (!session?.ok || !session?.is_subscriber) {
    window.location.href = "/members/login.html";
    return;
  }
  const who = document.getElementById("who");
  if (who) who.textContent = session.display_name ? `Welcome, ${session.display_name}` : "Welcome";
}

window.Members = { saveSession, loadSession, clearSession, verify, handleLogin, requireSubscriber };
