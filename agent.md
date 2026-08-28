---
name: react-dry-architecture
description: Use this skill whenever writing, adding to, or refactoring React code (including Next.js and React Native projects) — creating components, pages, hooks, API calls, or any new frontend feature. It enforces DRY (Don't Repeat Yourself) coding, reusable component design, a consistent scalable folder structure, a strict naming convention (PascalCase components, camelCase everything else), and clarifying questions before ambiguous work begins — so the codebase stays understandable to a new developer joining later. Always consult this skill before creating a new file or component in a React project, before deciding where a file should live or what to name it, before writing logic that resembles something already in the codebase, and before starting any task whose requirements aren't fully clear yet.
---

# React DRY Architecture

A skill for keeping React codebases DRY, reusable, and organized, so the project stays simple, scalable, and easy for a new developer to understand on day one.

This skill governs six things every time you touch a React codebase:

1. **Reuse before creation** — never write something that already exists.
2. **Folder structure** — every file has one obvious home.
3. **Naming convention** — PascalCase components, camelCase everything else.
4. **Simplicity boundaries** — don't over-engineer; don't under-engineer.
5. **`project.md`** — a live map of the codebase, read before exploring, updated after every change.
6. **Clarify before building** — ask questions until the task is fully understood, then proceed.

---

## 1. Reuse Before Creation (the core DRY rule)

Before writing ANY new component, hook, util, or type, follow this checklist in order:

1. **Search first.** Look in `src/components/ui/`, `src/components/shared/`, `src/hooks/`, and `src/lib/utils/` for anything that already does this or something close to it.
2. **If something similar exists**, extend it with a prop/variant instead of copy-pasting and tweaking. A `Button` that needs a new color is a new `variant`, not a new `PrimaryButton` file.
3. **If duplication is about to happen** (the same JSX block, the same fetch logic, the same validation, the same formatting function appearing a 2nd time), STOP and extract it into a shared component/hook/util _before_ continuing — don't wait for a "3rd occurrence" rule. Two is enough once you can see the pattern will repeat.
4. **Only create net-new** when nothing close exists. Even then, name and place it so the next person searching for it (per step 1) will find it.

### What almost always becomes a hook, not inline code

- Any `useEffect` + `useState` combo for fetching data → `useFetchX()`
- Any repeated form field logic → `useForm` / `useFormField`
- Any subscription/listener setup+teardown → a custom hook
- Any `localStorage`/`sessionStorage` read-write pattern → `useLocalStorage()`

### What almost always becomes a shared component, not a copy

- Any button, input, modal, card, badge, avatar, spinner, empty-state, or error-state that appears in more than one screen
- Any layout wrapper (page shell, sidebar, header) reused across routes

### What almost always becomes a util, not repeated logic

- Date/currency/number formatting
- API response shaping/normalizing
- Validation logic (email, phone, password rules)
- Constants used in more than one file (status enums, role names, route paths)

---

## 2. Folder Structure (feature-based, scalable)

Use this structure for any new or growing React project. It scales from a small app to a large one without needing a rewrite — you just add folders as features grow, you don't restructure.

```
src/
├── app/                      # App shell: routing, providers, global layout
│   ├── App.tsx
│   ├── routes.tsx            # Central route definitions
│   └── providers/            # Context providers (Auth, Theme, QueryClient, etc.)
│
├── pages/                    # One folder per route/screen — thin, composes features
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   └── index.ts
│   └── login/
│       ├── LoginPage.tsx
│       └── index.ts
│
├── features/                 # Domain/business logic, grouped by feature (NOT by type)
│   ├── chat/
│   │   ├── components/       # Components used only within this feature
│   │   │   ├── ChatWindow.tsx
│   │   │   └── MessageBubble.tsx
│   │   ├── hooks/
│   │   │   └── useChatSocket.ts
│   │   ├── api/              # API calls specific to this feature
│   │   │   └── chatApi.ts
│   │   ├── types.ts
│   │   │   └── index.ts          # Public exports — only this file is imported elsewhere
│   ├── orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types.ts
│   │   └── index.ts
│   └── products/
│       └── ...
│
├── components/                # Truly shared, feature-agnostic components
│   ├── ui/                    # Design-system primitives (Button, Input, Modal, Badge...)
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── modal/
│   └── shared/                 # Composite reusable components (SearchBar, EmptyState...)
│
├── hooks/                      # Shared hooks used across 2+ features
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── lib/                        # Framework-agnostic logic
│   ├── api/
│   │   └── client.ts            # Axios/fetch instance, interceptors
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── validators.ts
│   └── constants/
│       └── routes.ts
│
├── types/                      # Global/shared TypeScript types
│   └── index.ts
│
├── styles/                     # Global styles, Tailwind config, theme tokens
│   └── globals.css
│
└── assets/                     # Static files: images, icons, fonts
```

### Placement rules (use this to decide where a new file goes)

| If the file is...                                                              | It goes in...                                                        |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Used by only one feature                                                       | `features/<feature>/components/` (or `hooks/`, `api/`)               |
| Used by 2+ features, but is a design-system primitive (button, input, badge)   | `components/ui/`                                                     |
| Used by 2+ features, but is a composite (search bar, empty state, page header) | `components/shared/`                                                 |
| A hook used by 2+ features                                                     | `hooks/`                                                             |
| A hook used by only 1 feature                                                  | `features/<feature>/hooks/`                                          |
| Pure logic with no React (formatting, math, string helpers)                    | `lib/utils/`                                                         |
| An API call tied to one feature's domain                                       | `features/<feature>/api/`                                            |
| A shared API client/config (base URL, auth headers)                            | `lib/api/`                                                           |
| A full screen/route                                                            | `pages/` — and it should mostly just compose things from `features/` |
| A constant used in 2+ places                                                   | `lib/constants/`                                                     |

### Import rule

Only import from a feature's `index.ts` (its public export), never reach into `features/chat/components/MessageBubble.tsx` from outside the `chat` feature. This keeps features loosely coupled — a new developer can delete or rewrite a whole feature folder without hunting for stray imports elsewhere.

---

## 3. Naming Convention

- **Component files (`.tsx`) → PascalCase.** `Button.tsx`, `ChatWindow.tsx`, `OrderStatusBadge.tsx`. The file name matches the component name exactly.
- **Everything else (`.ts` files: hooks, utils, api, types, constants) → camelCase, first letter lowercase.** `useChatSocket.ts`, `useProduct.ts`, `formatDate.ts`, `chatApi.ts`, `routes.ts`. Hooks always start with `use`.
- **Folders → always lowercase** (e.g. `features/chat/`, `components/ui/button/`, `components/shared/sidebar/`). All folder names must start with a lowercase letter — no exceptions, even for component wrapper folders.
- **Never mix conventions within the same file type.** If you find an existing file that breaks this (e.g. a hook named `UseChat.ts` or a component named `button.tsx`), flag it and rename it as part of the change touching that file — don't propagate the inconsistency into new files.

---

## 4. Simplicity Boundaries

DRY and reusability can be taken too far. Balance against these rules:

- **Don't abstract for a single use case.** A component/hook used exactly once, with no planned second use, stays inline or local — don't pre-build a generic version "just in case." Premature abstraction is its own kind of clutter.
- **Prefer composition over configuration.** If a shared component starts needing 6+ boolean props to handle every variant, it's a sign to split it into 2 components or use children/slots instead of more props.
- **Keep components small and single-purpose.** If a component file exceeds roughly 150–200 lines or is doing more than one clear job (e.g., fetching data AND rendering a complex form AND handling submit logic), split it: a container (logic/data) + presentational pieces (UI).
- **Naming must be self-explanatory.** A new developer should be able to guess what `features/orders/hooks/useOrderStatus.ts` does from its path alone. Avoid vague names like `helpers.ts`, `utils2.ts`, `misc/`.
- **Every feature folder should be independently understandable.** Someone should be able to open `features/chat/` alone and understand the chat feature without needing to trace through five other folders first.

---

## 5. `project.md` — the map you read instead of exploring

Maintain a single file at the project root, `project.md`, that acts as a live index of the whole codebase. Its entire purpose is to let you (or any future session) answer "where does X live / what already exists" by reading **one file** instead of globbing, listing directories, or opening files to check. This directly cuts token usage — exploration is the expensive part, not editing.

### Rule: consult before explore

Before searching the filesystem, listing directories, or opening files to "see what's there," **read `project.md` first**. Only fall back to exploring the actual folders if:

- `project.md` doesn't exist yet (first time in this project — create it, see below), or
- `project.md` is missing an entry you need (treat this as a sign it's out of date — fix it once you find the answer), or
- You need the actual implementation detail inside a file, not just its purpose/location (project.md tells you _where_, not _how_).

Never re-explore a part of the tree that `project.md` already documents correctly.

### Rule: update after every change

Any time you create, move, rename, delete, or meaningfully repurpose a file, update its `project.md` entry in the same turn. A stale `project.md` is worse than none — it causes wrong assumptions. Treat "update project.md" as part of the task, not an optional extra step.

### Format

Keep it terse — this file is a lookup table, not documentation prose. One line per file/module wherever possible.

```markdown
# Project Map

> Read this file before exploring the codebase. Update it whenever files are added, moved, or removed.

## Features

### features/chat/

- `components/ChatWindow.tsx` — main widget UI shell, renders MessageBubble list + input box
- `components/MessageBubble.tsx` — single message, reused for bot/user/agent variants
- `hooks/useChatSocket.ts` — WebSocket connection + message send/receive state
- `api/chatApi.ts` — REST calls: fetch chat history, mark read
- `index.ts` exports: `ChatWindow`, `useChatSocket`

### features/orders/

- `components/OrderStatusBadge.tsx` — colored badge for order status enum
- `hooks/useOrderLookup.ts` — fetch order by id/email
- `api/ordersApi.ts` — REST calls to /orders
- `index.ts` exports: `OrderStatusBadge`, `useOrderLookup`

## Shared

### components/ui/

- `button/` — variants: primary, secondary, danger, ghost
- `modal/` — base modal, used by chat handoff confirm + order cancel confirm

### components/shared/

- `EmptyState.tsx` — used on Dashboard, Orders list, Chat history when no data

### hooks/

- `useDebounce.ts` — generic debounce, used in search bars
- `useLocalStorage.ts` — generic localStorage sync

### lib/utils/

- `formatDate.ts` — used across orders, chat timestamps
- `validators.ts` — email/phone/password rules

### lib/constants/

- `routes.ts` — all route path strings

## Pages

- `pages/dashboard/` — merchant dashboard home, composes features/orders + features/chat
- `pages/login/` — auth screen

## Open TODOs / known gaps

- (list anything half-built or intentionally deferred, so it isn't rediscovered by re-exploring)
```

### What to include per entry

For each file/module, one line covering: **what it is + what it's for + notable reuse (who else uses it)**. Skip anything a good name already makes obvious — don't pad the file. The test is: "if I only read this line, do I know whether I need to open the file at all?"

### When starting work in an existing project without a project.md

If you land in a codebase that doesn't have one, generate it once by doing a single full pass over the folder structure, then keep it updated from then on. Frame this to the user as a one-time cost that pays for itself on every future task.

---

## 6. Clarify Before Building

Do not start writing code on an ambiguous or underspecified request. Ask questions first, and keep asking until the task is concrete enough to implement without guessing at the parts that matter.

- **Ask when it would change the code you write** — which feature a component belongs to, what data shape an API returns, whether something is shared or single-use, what the different states/variants are, which existing component this should reuse or extend. These aren't nice-to-knows; guessing wrong here means rework and duplication, which fights the whole point of this skill.
- **Don't ask about things you can infer or that don't change the outcome.** If `project.md` or the existing code already answers it, use that instead of asking. If a reasonable default exists and getting it wrong is cheap to fix, state the assumption and proceed rather than stalling on a trivial point.
- **Batch questions, don't drip them.** Ask what's needed in one pass rather than going back and forth one question at a time.
- **One round is often not enough.** If the answers reveal new ambiguity, ask again before proceeding — "fully understood" is the bar, not "asked once."
- Once the task is clear, proceed without re-asking already-settled points.

---

## Working checklist (apply on every task)

When asked to build or modify something in a React codebase, do this before writing code:

1. **Make sure the task is fully understood.** If anything material is ambiguous, ask (see Section 6) before touching files.
2. **Read `project.md` first** to see what already exists and where — don't explore the filesystem if the map already answers the question.
3. Decide the correct home for any new file using the placement table above.
4. If duplicating logic/markup that already exists elsewhere, extract it into a shared piece instead.
5. Only create a new abstraction if it's used (or clearly about to be used) in more than one place.
6. Keep the new component/hook small, named clearly, and follow the naming convention in Section 3, and export it through its feature's `index.ts` if it's feature-scoped.
7. **Update `project.md`** to reflect any file you added, moved, renamed, or removed, before finishing the task.
