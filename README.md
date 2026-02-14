<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Math+ Studio Editor

This project is a Vite + React editor for Math+ JSON content.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local`
3. Start dev server:
   `npm run dev`

## Deploy on Vercel

### Recommended project settings

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Why the app could be blank after deployment

If all routes are rewritten to `/index.html` (including `/assets/*.js`), Vercel serves HTML instead of JavaScript chunks.
That causes a blank screen in the browser because the app bundle never loads.

This repository now uses a safer rewrite rule in `vercel.json`:
- rewrite only paths **without file extensions** to `index.html`
- keep static assets (`/assets/*.js`, `/assets/*.css`, etc.) untouched

### Cache strategy

- `/assets/*`: long cache (`immutable`) for hashed bundles
- all other files: revalidate on each request (`must-revalidate`)
