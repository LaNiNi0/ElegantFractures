# 우아한 균열 · Elegant Fractures

**Version 0.1 — Interactive fictional phone archive**

A smartphone-style companion website for the fictional 2027 Korean character drama **《우아한 균열》**.

## Features

- Responsive home screen styled as the player's fictional phone
- **Notes**: separate folders for **재율과의 기록** and **명가 기록**
- **Contacts**: fictional character index, with search and group filtering
- **Calendar**: browse 2027 and revisit major in-story dates
- **Calls and Messages**: clearly labeled *illustrative*, read-only fictional records
- **Browser**: a fictional internal browser, featuring the five houses
- **Gallery**: abstract placeholders, ready for approved artwork
- **Settings**: optional relationship publicity and nickname settings, plus spoiler visibility; saved only in local browser storage

**Editorial guidelines:** All personal feelings and player actions are deliberately left open; tentative dates are marked as drafts. Hidden story information should never be placed in public source files if it must remain genuinely secret. The spoiler toggle is only a presentation preference, not a security feature.

## Development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the URL shown by Vite. Production build:

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

Repository: [LaNiNi0/ElegantFractures](https://github.com/LaNiNi0/ElegantFractures)

The Vite base path is configured as `/ElegantFractures/`. The repository contains a workflow at `.github/workflows/deploy.yml`.

To publish, open **Settings → Pages → Build and deployment → Source → GitHub Actions** on GitHub. Then go to **Actions** and check the latest **Deploy Elegant Fractures to GitHub Pages** run. If the automatic run has not begun, choose **Run workflow**.

After successful deployment the expected URL is:

https://lanini0.github.io/ElegantFractures/

The URL is *not* confirmed live until the GitHub Pages deployment reports success.

## Project layout

```text
src/
  App.jsx          # home screen and app interactions
  data/story.js    # fictional source data
  styles.css       # responsive visual design
  main.jsx         # React entrypoint
.github/workflows/
  deploy.yml
index.html
vite.config.js
package.json
```

## Scope of this prototype

The browser is an **internal fictional story browser**, not an internet-connected browser. Phone calls and messages are sample read-only props, not real telephony. Gallery content is placeholder art until the user's approved character images are added. This is intentionally a **static website without user accounts or server-side data**.
