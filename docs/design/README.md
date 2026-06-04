# Psycron design decisions

Single source of truth for **design decisions + coding/design guidance** in `psycron-fe`.
Both humans and AI agents (Claude Code, Codex) read this folder before building UI, and
write decisions back to it. If a session is interrupted, the next one resumes from here.

## How to use it

- **Before building any UI**, read [`coding-and-design-guidelines.md`](./coding-and-design-guidelines.md).
- **Before/while building a feature**, read its decision record in [`decisions/`](./decisions).
  Each record carries a **Status** and a **Next steps** section — that is the resume point.
- **When you make or change a decision**, update the relevant record in the same PR. A decision
  is not "done" until it is written here.
- **Design previews** are generated to `/tmp/psycron-<feature>-preview.html` first (see the
  guidelines) and the approved one is referenced from the decision record.

## Index

| Area | Record | Status |
|------|--------|--------|
| Availability Settings revamp | [`decisions/availability-settings-revamp.md`](./decisions/availability-settings-revamp.md) | 🟡 Preview — awaiting sign-off |

> Durable cross-repo product/strategy decisions also live in the Obsidian vault
> (`07 Decisions`, `04 Engineering`). This folder is the **code-local** mirror agents follow.
