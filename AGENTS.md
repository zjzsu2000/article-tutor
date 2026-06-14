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
- After any non-trivial code change, if the change is user-visible or touches code logic, the Builder must automatically prepare the standard Codex review package after implementation and verification, before asking for commit approval. Do not wait for the human to ask for the review package.
- Put the review package in a task-specific directory under `/tmp`, such as `/tmp/<task-name>-review/`. For vocabulary notebook work, use `/tmp/vocabulary-notebook-review/`.
- The review package must include `REVIEW.md`, `changes.patch`, and `FIX_SUMMARY.md` when useful. After Codex review is run, save the full Codex output to `CODEX_REVIEW.md` in the same package directory. `REVIEW.md` must cover scope, out-of-scope items, files changed, root causes / intended behavior, verification run, risks, static export / config safety notes, and specific review focus areas.
- `changes.patch` must contain the complete working-tree diff, including untracked files. If new files are added, run `git add -N` for those files before generating the patch.
- The Builder must print the exact Codex command to run. The command must ask Codex to act as Reviewer under `docs/agent-loop.md`, review the working-tree changes against `REVIEW.md` and `docs/review-checklist.md`, not modify code, report blockers/minors/approval, include a ready-to-send Builder Follow-up Prompt, and save the full review output to `/tmp/<task-name>-review/CODEX_REVIEW.md`.
- After review, the Builder must read `CODEX_REVIEW.md` and extract the `Builder Follow-up Prompt` automatically. Do not require the human to copy/paste the review text back into the Builder.
- The Builder must not commit, push, or deploy until the human explicitly approves after review.
- Review reports must include a `Builder follow-up prompt` section that the human can send directly to the Builder. If there are blockers, the prompt should ask the Builder to fix only blockers first. If there are only minor findings, the prompt should say which to fix now and which to defer. If there are no requested changes, the prompt should state that the change is approved and ready for the human commit decision. Always include no-commit/no-push/no-deploy guidance unless the human explicitly approved those actions.
