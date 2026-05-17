# Deployment

The app is a fully static site. Any static host works.

## Build

```bash
npm install   # first time, or after dependency changes
npm run build
```

Output:

- `out/` — the entire static site (HTML, CSS, JS, assets, redirects).
- 23 HTML files for the current content (8 articles × 2 locales + topic
  cards + vocabulary pages + a root redirect + 404).

Verify locally before deploying:

```bash
npx tsc --noEmit       # type check
npm run build          # production build
npx serve out          # optional: serve out/ on a local port
```

## Static export hosting

Any host that serves a folder of HTML files works. Typical settings:

| Field | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Output directory | `out` |
| Node version (host env var) | `20` |

No backend, no API routes, no server runtime. Nothing to provision
beyond the static host itself.

## Push-based hosts (recommended)

When the repo is connected to a host's Git integration, every push to
`main` triggers a fresh build and deploy. **Example: Vercel** — once the
repo is connected with the Production branch set to `main`, no manual
step is needed after `git push`.

Confirming a deploy ran:

- The host's dashboard shows a new deployment with the latest commit
  hash.
- The host's CLI (if installed and authenticated) typically has a
  `... ls` or `... deployments list` command that shows the latest
  build's status and duration.

## Manual deploys (e.g. Cloudflare Pages in Direct Upload mode)

If a host was created in Direct Upload mode rather than via Git, every
update needs a manual deploy. From a local checkout with a fresh `out/`:

```bash
npm run build && \
  npx wrangler pages deploy out --project-name english-study --branch main
```

`wrangler` will pick up `CLOUDFLARE_API_TOKEN` from the environment;
provide it via your shell's normal env handling, not by committing
anything to the repo.

**To switch a Direct-Upload project to push-based**: delete the existing
project in the host dashboard and recreate it under "Pages → Connect to
Git", pointing at the same repo and branch with the build settings
above. Project naming and the public URL prefix can be kept the same on
recreation.

## Keep secrets out of the repo

- Never commit a `CLOUDFLARE_API_TOKEN`, Vercel token, or any other
  deployment credential.
- Use the host's own secrets / environment-variable management.
- `.gitignore` already excludes `.vercel/`, `.wrangler/`, and `.env*`
  (other than `.env.example`). Leave those rules in place.
- If a credential is accidentally committed: rotate the credential at
  the issuing platform immediately, do not rely on `git rm` alone — git
  history preserves it.

## Verifying a deploy

After a deploy, a quick smoke test:

| Path | Expected |
|---|---|
| `/` | 200 or redirect (depending on locale) |
| `/zh/` | 200, topic cards render with Chinese titles |
| `/en/` | 200, topic cards render with English titles |
| `/zh/articles/first-day/` | 200, sentences render, click handlers wired |
| `/zh/vocabulary/` | 200, empty state shown on a fresh device |

Browser-side checks (open DevTools console while clicking around):

- Tapping a word opens the side panel with definition / IPA / example.
- Tapping a sentence opens the side panel with translation / grammar.
- Tapping "🔊 Read aloud" reads the article; the current sentence
  highlights.
- Tapping a word / sentence mid-playback interrupts the article cleanly.
- On a browser without Web Speech API, the read-aloud button is replaced
  with a friendly notice (reading and tap-to-explain still work).
