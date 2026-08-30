---
name: react-dry-architecture
description: Use when writing, adding to, or refactoring React/Next.js/React Native code — new components, pages, hooks, API calls, or features. Enforces DRY code, reusable components, a fixed folder structure, PascalCase/camelCase naming, and clarifying ambiguous requests before building.
---

# React DRY Architecture

Six rules, applied on every task, in this order:

## 1. Reuse before creating
- Search `components/ui/`, `components/shared/`, `hooks/`, `lib/utils/` for anything close to what you need.
- Extend existing pieces with a prop/variant instead of copying (`Button` + `variant`, not `PrimaryButton`).
- Duplication is a signal, not a threshold — extract to a shared component/hook/util as soon as you see the same JSX, fetch, validation, or formatting logic used a 2nd time.
- Only build net-new when nothing close exists; name/place it so it's found next time.

**Common extractions:** data fetching → `useFetchX()` hook · repeated form logic → `useForm()` · storage read/write → `useLocalStorage()` · repeated buttons/inputs/modals/cards/empty-states → shared component · date/currency/validation logic → `lib/utils/`.

## 2. Folder structure
```
src/
├─ app/            # routing, providers, global layout
├─ pages/          # one folder per route, thin — composes features/
├─ features/<name>/
│  ├─ components/  # feature-only components
│  ├─ hooks/       # feature-only hooks
│  ├─ api/         # feature-only API calls
│  ├─ types.ts
│  └─ index.ts     # ONLY public export — never import from inside a feature
├─ components/
│  ├─ ui/          # design-system primitives (Button, Modal, Badge)
│  └─ shared/      # composite reusable components (SearchBar, EmptyState)
├─ hooks/          # hooks used by 2+ features
├─ lib/
│  ├─ api/         # shared API client/config
│  ├─ utils/       # pure logic, no React
│  └─ constants/
├─ types/          # global types
├─ styles/
└─ assets/
```
**Placement rule of thumb:** single-feature → `features/<name>/…`. Shared primitive → `components/ui/`. Shared composite → `components/shared/`. Shared hook → `hooks/`. Framework-agnostic logic → `lib/utils/`. Constant used in 2+ places → `lib/constants/`.

## 3. Naming
- Components (`.tsx`) → **PascalCase**, filename = component name.
- Everything else (`.ts`: hooks, utils, api, types) → **camelCase**; hooks start with `use`.
- Folders → always **lowercase**.
- Fix inconsistent existing names when you touch that file; don't propagate them.

## 4. Simplicity boundaries
- Don't abstract a one-off — inline it until a real 2nd use appears.
- A component needing 6+ boolean props → split it or use composition/children instead.
- Split components over ~150–200 lines or doing more than one job (fetch + render + submit logic) into container + presentational pieces.
- Names must be self-explanatory from their path; no `helpers.ts`, `misc/`, `utils2.ts`.

## 5. `project.md` — codebase map
Maintain one root file, `project.md`, as a terse lookup table (one line per file: what it is + what it's for + who else uses it). **Read it before exploring the filesystem.** Only explore directly if it's missing, out of date, or you need implementation detail it doesn't cover.
**Update it in the same turn** any file is added, moved, renamed, or deleted — a stale map is worse than none.
If a project has no `project.md`, generate it once from a single full pass, then maintain it going forward.

Minimal format:
```markdown
# Project Map
## features/chat/
- components/ChatWindow.tsx — main widget shell, renders MessageBubble + input
- hooks/useChatSocket.ts — websocket connection + send/receive state
- index.ts exports: ChatWindow, useChatSocket
## Shared
- components/ui/button/ — variants: primary, secondary, danger, ghost
- hooks/useDebounce.ts — generic debounce, used in search bars
## Open TODOs
- (half-built or deferred work, so it isn't rediscovered)
```

## 6. Clarify before building
Ask, in one batched pass, only about things that would change the code (which feature it belongs to, data shape, shared vs single-use, variants, what to reuse/extend). Don't ask what `project.md` or existing code already answers, or what's cheap to fix later — state the assumption and proceed instead.

---

## Checklist per task
1. Task fully understood? If not, ask (§6).
2. Read `project.md` first — don't explore blindly.
3. Place new file per §2's rule of thumb.
4. Duplicating existing logic? Extract instead (§1).
5. New abstraction only if used 2+ places.
6. Name per §3; export via feature's `index.ts` if feature-scoped.
7. Update `project.md` before finishing.