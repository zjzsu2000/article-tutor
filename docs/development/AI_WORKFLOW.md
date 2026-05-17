# AI-assisted development workflow

This project uses AI coding assistants for most code changes. The flow
below is what works well in practice. Following it keeps the diff small,
the review fast, and the deploy boring.

## The loop

```
clarify need + boundaries
  → AI coding assistant implements
  → AI reports files changed and build result
  → human reviews
  → commit / push only after explicit approval
```

Each round should fit comfortably in one PR's worth of diff. If a task
sprawls across many files or many concerns, split it into rounds.

## 1. Clarify need and boundaries up front

Before the AI writes anything, the human should write down:

- **What is being changed.** One or two sentences.
- **Scope of the change.** "Touch only `lib/foo.ts`" or "data layer only,
  no UI" or "UI behavior unchanged".
- **Out-of-scope items.** No backend, no new dependencies, no schema
  changes, no settings UI yet, etc.
- **Acceptance signals.** What the human will check before approving.

A short brief beats a long one. Reviewer should be able to predict the
diff shape from the brief alone.

## 2. The AI implements

Expected behaviour from the assistant:

- Read relevant files first; don't guess at structure.
- Apply the **smallest** change that meets the brief.
- Do not refactor unrelated code, even if "while we're in there".
- Do not introduce new dependencies without asking.
- Do not invent acceptance criteria the human did not ask for.

If the brief is ambiguous, ask one clarifying question, don't guess and
ship.

## 3. Run both checks before reporting

Every change, however small, should pass:

```bash
npx tsc --noEmit
npm run build
```

Reporting "done" without a clean build is wasted time.

## 4. Report files changed + build result

The assistant's final report for a round should include, at minimum:

- **Files changed**, ideally as `git diff --stat HEAD`.
- **Build result** (tsc clean, `npm run build` succeeded, page count
  unchanged or explained).
- **What changed and why**, in 3–10 lines. Not a re-narration of the
  diff.
- **Anything the human should test manually** that the build can't
  verify (e.g. a visual change, a TTS behavior, mobile-only behavior).
- **Suggested commit message.**

Then **stop and wait**. Do not commit yet.

## 5. Human reviews

Reviewer checks:

- Does the diff match the brief? Anything extra?
- Did anything unrelated change?
- Does the suggested commit message describe the actual change?
- Anything to manually test before pushing?

If revisions are needed, the human says so. The assistant adjusts and
re-reports. The cycle is cheap as long as the diff stays small.

## 6. Commit and push only after approval

After the human says "commit and push" (or equivalent):

- Use the agreed commit message verbatim if the human supplied one.
- Stage **only** the files in the brief. Don't sweep in unrelated
  modifications.
- If multiple logical changes are in the working tree, commit them as
  **separate commits** with separate messages, even if pushing them in
  one push event.
- Push to `origin/main` (or the agreed branch).
- After pushing, confirm:
  - `git status` is clean.
  - The latest commit hash matches.
  - The push-based host (e.g. Vercel) registered a new build.
  - Whether any manual-deploy host (e.g. a Direct-Upload Cloudflare Pages
    project) needs a follow-up `wrangler pages deploy`.

If a hook fails or a build breaks after commit, **fix forward with a new
commit**. Don't `--amend` a pushed commit; don't `--no-verify` around a
hook failure unless explicitly asked.

## Commit style

- Conventional Commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`,
  `refactor:`, etc.
- Subject line under ~70 characters; details in the body if needed.
- One logical change per commit.
- Co-authorship trailer when the assistant materially wrote the change
  (kept consistent across this repo's history).

## Things to avoid

- Don't bundle unrelated changes into one commit "for convenience".
- Don't commit generated artifacts (`out/`, `.next/`, etc.) — `.gitignore`
  already excludes them.
- Don't commit any credential, even temporarily.
- Don't expand scope mid-round to "fix something on the way" — open a
  follow-up round.
- Don't add backend, server actions, API routes, or middleware to this
  static-export app without an explicit human decision; it would break
  the deployment model.
- Don't change deployment configuration silently.

## When the human is offline

If the AI is operating in a more autonomous mode (no synchronous human
in the loop), the same brief / implement / verify pattern still applies.
The substitute for "human reviews" is:

- Tighter, more conservative scoping (do less, not more).
- Write the suggested commit message and report somewhere the human can
  see it next time, rather than committing speculative changes.
- Never push uncommitted changes that the human hasn't approved.

The goal is the same: small, reviewable, reversible steps.
