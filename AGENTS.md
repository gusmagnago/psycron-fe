# AGENTS.md

Instructions for Codex when working in `psycron-fe`.

## Psycron Context

Psycron is the admin operating system for independent care professionals. It is not a generic CRUD app. Every user-facing change should reduce admin time, reduce no-shows, reduce compliance risk, or remove a manual step.

Local Obsidian vault:

```text
/Users/gusmagnago/Documents/Obsidian Vault/Psycron
```

Always check the Obsidian vault before starting Psycron work so product, engineering, compliance, and release context stay aligned across agents and sessions.

Before product, UX, architecture, compliance, analytics, AI, scheduling, booking, reminders, payments, or patient/practitioner data work, read the relevant notes:

- `10 AI Context/Psycron Brief.md`
- `10 AI Context/Product Principles.md`
- `10 AI Context/Engineering Rules.md`
- `10 AI Context/Compliance Rules.md`
- `10 AI Context/Agent Handoff.md`
- `04 Engineering/Repository Map.md`
- `04 Engineering/Frontend Architecture Map.md`
- `04 Engineering/GitHub Workflow Map.md`
- `04 Engineering/Release And Versioning Map.md`
- `07 Decisions/Decision Log.md`

If implementation creates a durable product or architecture decision, update the vault's `07 Decisions/Decision Log.md` or create a new decision note.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run storybook
npm run preview
```

Run `npm run lint` after code changes. Use `npm run build` when touching routing, build behavior, PWA behavior, environment assumptions, or shared application wiring.

## Branching And Release

- `dev` is the integration root before `main`.
- Start feature/fix branches from `dev`.
- Open implementation PRs back into `dev`.
- Only promote `dev` into `main` for release.
- This repo tracks launch readiness in `.github/release-requirements.json`.
- Update `.github/release-requirements.json` when a frontend change alters feature, blocker, or v1.0.0 readiness status.
- When product/version evidence changes, update Jira and Confluence references as part of the handoff.

## Frontend Rules

- Use TypeScript strictly. Do not use `any`; narrow `unknown` instead.
- Reuse existing components, hooks, API functions, contexts, helpers, and types before creating new ones.
- Prefer `@psycron/*` imports for internal modules.
- Use wrapped Psycron components where they exist.
- Keep page components thin and push logic into hooks.
- Keep styles in `.styles.tsx`; avoid `sx`, `style`, and `className` in component files unless an existing local pattern requires it.
- Use theme tokens for colors, spacing, shadows, and breakpoints.
- Put user-facing text in i18n translation files.
- Keep locale-aware routing and date/currency/phone formatting intact.
- Do not send PHI or sensitive patient/practitioner data to PostHog, Sentry, logs, screenshots, or AI prompts.

## Product Language

- Prefer `practitioner` over `therapist` unless referring to a specific therapist persona.
- Prefer `session` over `therapy`.
- `patient` is acceptable domain language.
- Jupiter should behave like a practical workflow assistant, not a generic chatbot.

## Git

Never commit unless Gus explicitly asks. Summarize the diff and verification first.
