# Agent Loop

This repo uses a controlled Builder / Reviewer / Human-gate workflow. The goal is to keep AI-assisted changes small, inspectable, and easy to stop before risky work lands.

## Roles

### ChatGPT

ChatGPT helps define structure, prompts, acceptance criteria, and review strategy. It is useful for turning a vague product need into a small implementation brief.

### Codex

Codex can maintain docs, checkpoints, review briefs, and review prompts. It can also inspect diffs, run verification, and prepare findings for the human gate.

### Claude Code

Claude Code is the preferred builder for code changes in this repo. It should receive a narrow brief, implement the smallest useful diff, run checks, and stop for review.

### Human Gate

The human reviews before commit, push, or deploy. The human decides whether the diff is acceptable, whether the task stayed in scope, and whether a follow-up is needed.

Human approval is required before every commit, push, or deploy. The current human instruction wins over standing workflow docs for the active session.

## Standard Loop

1. Define one small task and explicit out-of-scope boundaries.
2. Check `docs/checkpoint.md` for current project state.
3. Builder implements the narrow change.
4. Builder runs relevant verification commands.
5. If the change is user-visible or touches code logic, Builder prepares the standard Codex review package automatically before asking for commit approval.
6. Reviewer inspects the diff against the brief and `docs/review-checklist.md`.
7. Human approves, asks for revisions, or stops the round.
8. Commit, push, or deploy only after explicit human approval.

Generating code is not a completion signal by itself. Every report must include build/test/review status, or clearly state which checks were skipped and why.

## Builder Review Package

After implementation and verification, any non-trivial code change that is user-visible or touches code logic must get a review package automatically. The Builder should not wait for the human to ask for it.

Use a task-specific path under `/tmp`, for example:

```bash
/tmp/<task-name>-review/
```

For vocabulary notebook work, use:

```bash
/tmp/vocabulary-notebook-review/
```

The package must include:

- `REVIEW.md`
- `changes.patch`
- `FIX_SUMMARY.md` when useful
- `CODEX_REVIEW.md` after Codex review is run

`REVIEW.md` must include:

- Scope.
- Out-of-scope.
- Files changed.
- Root causes / intended behavior.
- Verification run.
- Risks.
- Static export / config safety notes.
- Specific review focus areas.

`changes.patch` must contain the complete working-tree diff, including untracked files. If the task adds new files, run `git add -N <new-file>` before generating the patch so those files appear in `git diff`.

After creating the package, the Builder must print the exact Codex command for the human to run. The command must save the full Codex output to `CODEX_REVIEW.md` in the same package directory. Use this shape, replacing the package path as needed:

```bash
codex "Act as Reviewer under docs/agent-loop.md. Review the working-tree changes against /tmp/<task-name>-review/REVIEW.md and docs/review-checklist.md, using /tmp/<task-name>-review/changes.patch as the patch under review. Do not modify code. Report Blockers, Minor Findings, Approve / Reject, and Verified checks. End with a Builder Follow-up Prompt that is directly copyable to Claude Code. Do not commit, push, or deploy." | tee /tmp/<task-name>-review/CODEX_REVIEW.md
```

After Codex review completes, the Builder must read `/tmp/<task-name>-review/CODEX_REVIEW.md`, extract the `Builder Follow-up Prompt`, and use that prompt for the next Builder step. The human should not have to copy/paste review text manually.

The human gate still applies after review: the Builder must not commit, push, or deploy until the human explicitly approves.

## Reviewer Output

After every review, the Reviewer must include a `Builder follow-up prompt` section. The prompt should be ready to send directly to Claude Code or whichever Builder is doing the next implementation step.

The Reviewer output must include these sections:

- Blockers
- Minor Findings
- Approve / Reject
- Verified checks
- Builder Follow-up Prompt

Use these rules:

- If there are blockers, the prompt tells the Builder to fix only the blockers first, includes exact files/functions when known, asks for focused verification, and says not to commit, push, or deploy.
- If there are only minor findings, the prompt says which minor findings to fix now and which to accept or defer, includes verification commands, and says not to commit, push, or deploy unless explicitly approved.
- If the change is approved with no requested edits, the prompt says the change is approved and ready for the human commit decision, and includes the recommended commit message.

This section is required even when the review result is approval. The goal is to avoid a second prompt-writing round after every Codex review.

## Stop Conditions

Stop and ask the human before continuing when any of these happen:

- Requirement is unclear or conflicts with existing project constraints.
- Diff becomes large, crosses multiple concerns, or no longer fits one reviewable round.
- Build, typecheck, lint, or a relevant manual check fails.
- Change touches deployment, auth, secrets, environment variables, hosting config, package manager config, or dependency policy.
- Content quality is uncertain, especially learner-facing English, Chinese explanations, quiz answers, or age appropriateness.
- The implementation would remove or weaken an existing feature.

## Review Package Pattern

For user-visible or code-logic changes, use the automatic Builder Review Package process above. For docs-only or very small non-code rounds, a lightweight final report may be enough unless the human asks for a package.
