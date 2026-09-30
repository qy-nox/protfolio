# protfolio — Personal Developer Platform

This repository is now a static, data-driven personal developer platform built on top of the original editorial visual identity (loader, custom cursor, flow/matrix canvas effects, slideshow, terminal animation, modal, theme toggle, and clock).

## Architecture

- **Static-first hash routing** (`#/`, `#/about`, `#/projects`, `#/projects/:slug`, etc.)
- **Single source of editable content** in `data.js`
- **Frontend-only Firebase adapter layer** in `firebase-adapter.js` for future auth/Firestore/Storage integration
- **No fake backend success paths**: unavailable actions are clearly shown as unavailable

## Routes

Public routes:

- `#/` Home
- `#/about`
- `#/projects`
- `#/projects/:slug`
- `#/apps`
- `#/apps/:slug`
- `#/blog`
- `#/blog/:slug`
- `#/lab`
- `#/learning`
- `#/resources`
- `#/contact`
- `#/privacy`
- `#/terms`

Admin route:

- `#/admin` (protected UI state via local login gate; **not security**)

## Quick local setup

No install step is required for this static version.

```bash
# from repo root
python -m http.server 4173
# then open http://localhost:4173
```

## Editable content

Update `data.js` to manage:

- profile/about content
- technologies
- projects
- apps
- blog posts
- lab experiments
- learning timeline/goals
- resources
- legal content
- social links

## Contact form behavior

- Client-side validation is active.
- By default, submissions are intentionally unavailable.
- To enable real submission, set `site.contactEndpoint` in `data.js` to a real endpoint.

## Firebase integration (future-ready)

Current build intentionally does **not** ship Firebase credentials or production auth logic.

1. Copy `.env.example` into your own environment management flow.
2. Implement Firebase SDK initialization and attach config to `window.__FIREBASE_CONFIG__`.
3. Replace adapter stubs in `firebase-adapter.js` with real read/write/auth logic.
4. Apply Firestore and Storage rules from `docs/firestore.rules.example` and `docs/storage.rules.example`.

### Suggested Firestore collections

- `projects`
- `apps`
- `posts`
- `categories`
- `tags`
- `resources`
- `lab`
- `learning`
- `settings`
- `users`

### Suggested storage paths

- `profile/{filename}`
- `projects/{projectSlug}/{filename}`
- `apps/{appSlug}/{filename}`
- `posts/{postSlug}/{filename}`
- `downloads/{type}/{filename}`

## Admin bootstrap guidance

This static build includes a protected-state admin UI shell (`#/admin`):

- login form with validation
- dashboard metrics
- management tabs (projects, apps, posts, media, categories, tags, settings)
- loading/empty/error state messaging

To make this production-ready:

1. Add Firebase Authentication
2. Restrict reads/writes with Firestore + Storage rules
3. Replace demo local auth state with token/session-based auth
4. Implement CRUD calls through the adapter

## SEO and deployment assets

- `robots.txt`
- `sitemap.xml`
- canonical/meta/OG/Twitter metadata in `index.html`

## Deploy

### GitHub Pages

- Serve repository root as static site.
- Ensure URLs keep hash-routing behavior.

### Vercel

- Framework preset: **Other**
- Build command: _(none)_
- Output directory: repository root
- Optional: add rewrite to always serve `index.html` if moving away from hash routing.

### Firebase Hosting

```bash
firebase init hosting
firebase deploy
```

Set public directory to repository root (or a dedicated `public` folder if you reorganize).

## Testing checklist

See [`docs/testing-checklist.md`](docs/testing-checklist.md).

## Known limitations

- Admin auth and CRUD are UI shell only until Firebase SDK and rules are fully wired.
- Contact form does not submit unless endpoint is configured.
- Some external preview images rely on third-party URLs.
