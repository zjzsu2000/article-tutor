# Agent Instructions

These instructions apply to future AI coding sessions in this repo.

## Instruction Priority

- The current human instruction always wins for the current session.
- When there is no current conflicting human instruction, use this file and `docs/checkpoint.md` to guide the next AI session.
- If repo docs conflict with each other, prefer the more specific and more recent human-authored instruction.

## Working Rules

- Keep changes small, focused, and reviewable.
- Handle one task per session. If the request grows, split it into a follow-up task.
- Read `docs/checkpoint.md` before coding or changing project behavior.
- Read the relevant source files before editing; do not guess at structure.
- Do not remove or disable existing features without explicit approval.
- Do not change deployment, auth, secrets, environment, or hosting config unless explicitly requested.
- Do not change `package.json` or add dependencies unless the task clearly requires it and the human approves.
- Keep the static export constraint intact: no API routes, middleware, server runtime, backend, database, or auth unless explicitly requested.

## Verification

Before claiming a code change is done, run the existing relevant commands and report the result:

```bash
npx tsc --noEmit
npm run build
npm run lint
```

If a command is unavailable, broken for an existing reason, or not relevant to a docs-only change, say so clearly instead of implying it passed.

Never mark a task complete only because code was generated. A completion report must include build/test/review status, including any skipped checks and why they were skipped.

## Documentation

- Update `docs/checkpoint.md` after meaningful changes so the next session has compressed context.
- Update release notes, changelog, or review prompts only when the change affects user-visible behavior, workflow, or release state.
- Keep docs factual and concise. Do not describe planned work as already shipped.

## Git And Review

- Do not commit, push, or deploy without explicit human approval.
- Human approval is required before every commit, push, or deploy.
- Stage only files that belong to the requested task.
- Preserve unrelated working-tree changes; do not revert work you did not make.
- Final reports should include files changed, verification commands, any skipped checks, and suggested next steps.
