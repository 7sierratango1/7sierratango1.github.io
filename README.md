# 7SierraTango1 Modern Site (Rev 1.0.1)

This is a **modern, neon, logo-matched** static website starter. It is designed to be **very different** from your current Google Site,
and to give every tool/game its own home with simple, programmable pages.

## Brand palette (extracted from your logo)
- Pink: #F148DF
- Blue: #6AAFD2
- Green: #23A854
- Background: #000000

## What you can edit fast
- **/data/tools.json**: add/remove tools, tags, links
- **/data/games.json**: add/remove games, tags, links
- Add more pages: copy **tools.html** → rename → update nav/buttons

## Local preview
Option A (quick): open `index.html` in your browser.
- Note: some browsers block `fetch()` for local files. If the tools/games list doesn't load, use Option B.

Option B (recommended): run a tiny local web server:
- Windows PowerShell:
  - `python -m http.server 8080`
- Then open: `http://localhost:8080`

## Hosting options (so it works with a custom domain)
- Cloudflare Pages / Netlify / GitHub Pages (static hosting)
- Then point `7sierratango1.com` (or a subdomain) to your host

## Using it with Google Sites (limitations)
Google Sites does **not** let you fully replace the site's HTML/CSS globally.
You can still:
- Use **Embed → URL** to embed a hosted version of this site inside a page, or
- Use this as the main site (recommended) and keep Google Sites as a lightweight link hub.

## Subscriber-only login (important facts)
- A real subscriber gate **requires a backend** (you cannot securely do this only in browser JS).
- Twitch subscriber verification requires:
  1) Twitch OAuth login (get an access token)
  2) A server-side call to Twitch API to verify the user + check whether they are subscribed

### Recommended simple backend
Use **Cloudflare Workers** or **Firebase Functions** to host:
- `POST /api/twitch/verify` (see `assets/js/auth.js`)

You will need:
- Twitch Client ID
- Twitch Client Secret
- Broadcaster ID
- Proper OAuth scopes for subscription checks

If you want, tell me which backend you prefer (Cloudflare Worker or Firebase), and I’ll generate the full backend code + deploy steps.

## Next steps to match YOUR current site content
I did not copy the tool/game list from `7sierratango1.com` because I don’t have the page inventory in this workspace.
If you paste the list (or upload an export / screenshot list), I’ll populate `tools.json` and `games.json` for you.
