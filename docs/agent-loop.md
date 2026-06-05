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
5. Reviewer inspects the diff against the brief and `docs/review-checklist.md`.
6. Human approves, asks for revisions, or stops the round.
7. Commit, push, or deploy only after explicit human approval.

Generating code is not a completion signal by itself. Every report must include build/test/review status, or clearly state which checks were skipped and why.

## Stop Conditions

Stop and ask the human before continuing when any of these happen:

- Requirement is unclear or conflicts with existing project constraints.
- Diff becomes large, crosses multiple concerns, or no longer fits one reviewable round.
- Build, typecheck, lint, or a relevant manual check fails.
- Change touches deployment, auth, secrets, environment variables, hosting config, package manager config, or dependency policy.
- Content quality is uncertain, especially learner-facing English, Chinese explanations, quiz answers, or age appropriateness.
- The implementation would remove or weaken an existing feature.

## Review Package Pattern

For larger rounds, create a review package outside the repo or in a clearly named docs folder:

- A short brief with scope, constraints, out-of-scope items, and focus areas.
- A complete patch or clear pointer to the current working-tree diff.
- Verification already run by the builder.
- Specific files or content blocks that need human-style review.
