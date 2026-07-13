# AI Tone Rephraser

Paste in text, pick a tone, and get it rewritten by Claude. Ships as an installable
web app (PWA) so it can be added to your iPhone home screen like a native app.

## Run locally

```bash
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm start
```

Open http://localhost:3000.

Get an API key at https://console.anthropic.com/settings/keys.

## Add it to your iPhone home screen

Home screen install requires the app to be served over **HTTPS from a public
URL** — Safari won't offer "Add to Home Screen" for `localhost`. Deploy it
first (see below), then on your iPhone:

1. Open the deployed URL in **Safari**.
2. Tap the **Share** icon (square with an arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**.

It'll launch full-screen from your home screen icon, no browser chrome.

## Deploy

Any Node host works. Fastest options:

**Render**
1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Create a new **Web Service** on https://render.com, connect the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Add an environment variable `ANTHROPIC_API_KEY` with your key.

**Railway**
1. https://railway.app → New Project → Deploy from GitHub repo.
2. Add the `ANTHROPIC_API_KEY` environment variable.
3. Railway auto-detects the start command from `package.json`.

Either gives you a public HTTPS URL — that's what you open in Safari to install.

## How it works

- `server.js` — Express server exposing `POST /api/rephrase`, which calls the
  Claude API (`claude-sonnet-5`) with the input text and selected tone.
- `public/` — static frontend (vanilla HTML/CSS/JS), plus `manifest.json` and
  `sw.js` for PWA installability and offline app-shell caching.
- The Anthropic API key stays server-side only; the frontend never sees it.
