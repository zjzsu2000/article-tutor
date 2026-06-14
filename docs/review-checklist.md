# Review Checklist

Use this checklist before accepting Claude Code or other builder changes.

## Scope

- The diff matches the brief.
- The change stayed in one reviewable task.
- No unrelated refactors or cleanup were bundled in.
- Existing features were not removed, disabled, or weakened without explicit approval.

## Files Changed

- Review `git status --short`.
- Review `git diff --stat`.
- Confirm every changed file belongs to the task.
- Confirm generated artifacts such as `.next/` or `out/` were not added.

## Review Package

- For any non-trivial user-visible or code-logic change, confirm the Builder prepared a task-specific review package under `/tmp`, for example `/tmp/<task-name>-review/`.
- For vocabulary notebook work, confirm the package path is `/tmp/vocabulary-notebook-review/`.
- Confirm the package includes `REVIEW.md`, `changes.patch`, `FIX_SUMMARY.md` when useful, and `CODEX_REVIEW.md` after Codex review is run.
- Confirm `REVIEW.md` covers scope, out-of-scope, files changed, root causes / intended behavior, verification run, risks, static export / config safety notes, and specific review focus areas.
- Confirm `changes.patch` contains the complete working-tree diff, including untracked files. If files were newly added, confirm the Builder used `git add -N` before generating the patch.
- Confirm the Builder printed an exact Codex command that asks Codex to act as Reviewer under `docs/agent-loop.md`, review against `REVIEW.md` and this checklist, not modify code, report blockers/minors/approval, include a ready-to-send Builder Follow-up Prompt, and save the full output to `/tmp/<task-name>-review/CODEX_REVIEW.md`.
- Confirm the Builder read `CODEX_REVIEW.md` and extracted the `Builder Follow-up Prompt` automatically, instead of requiring the human to copy/paste review text.

## Verification

- Builder reported command results.
- Builder did not mark the task complete only because files were generated.
- `npx tsc --noEmit` passed, or any skip/failure is explained.
- `npm run build` passed for code changes, especially because this app uses static export.
- `npm run lint` passed if available, or any existing limitation is documented.
- Manual checks were done for behavior that automation cannot cover.

## UX And Content Quality

- Learner-facing text is age-appropriate for Chinese-native elementary or middle-school learners.
- Quiz answers are unambiguous and each `correctAnswer` exactly matches one option.
- UI copy is encouraging, not exam-like.
- All user-facing strings go through `lib/i18n.ts`.
- Accessibility is not reduced: keyboard use, labels, color-independent feedback, and reduced-motion handling remain intact.

## Config Safety

- Human approval is present before any commit, push, or deploy.
- No accidental deployment, auth, secrets, hosting, environment, or package-manager config changes.
- No backend, API route, middleware, database, or server runtime was introduced.
- `output: "export"` remains compatible.
- No credentials, tokens, private endpoints, or local-only paths were committed.

## Docs And Release State

- `docs/checkpoint.md` was updated after meaningful changes.
- Release note or changelog was updated for user-visible behavior changes.
- Review package or review prompt was updated if the next round needs focused review.
- Suggested commit message matches the actual diff.

## Reviewer Output Format

- The report includes these sections: `Blockers`, `Minor Findings`, `Approve / Reject`, `Verified checks`, and `Builder Follow-up Prompt`.
- Findings are grouped by severity, with blockers called out first.
- The review result is explicit: approve, approve with follow-up, or reject.
- The report includes a `Builder follow-up prompt` section ready to send to the Builder.
- If there are blockers, the prompt instructs the Builder to fix only the blockers first, names exact files/functions when known, and says not to commit, push, or deploy.
- If there are only minor findings, the prompt says which findings to fix now and which to accept or defer, includes verification commands, and says not to commit, push, or deploy unless explicitly approved.
- If approved with no requested changes, the prompt says the change is approved and ready for the human commit decision, and includes the recommended commit message.
