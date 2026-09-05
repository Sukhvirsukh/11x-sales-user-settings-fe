# Frontend Engineering Skill

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Router
- TanStack Query
- React Hook Form + Zod

---

## 1. Project Workflow

**Before making any change:**

1. Read `project.md` first.
2. Identify only the files relevant to the task.
3. Check for existing components, hooks, utilities, and logic.
4. Reuse existing code before creating new code.
5. Do not explore unrelated files.
6. Make the smallest change required.
7. Validate the change.
8. Update `project.md` if architecture, features, components, pages, or important project knowledge changed.

If `project.md` doesn't exist, create it.

`project.md` is the project's navigation map. Keep it concise and useful.

---

## 2. DRY & Reusability

Follow DRY strictly.

Before creating anything new, check whether it can be:

- reused
- extended
- extracted from existing code

Reuse:

- components
- hooks
- utilities
- API logic
- validation schemas
- constants
- types

Do not over-engineer. Create abstractions only when they provide real reuse or clarity.

---

## 3. Naming Conventions

### Components

Use PascalCase:

```text
Dashboard.tsx
Analytics.tsx
PageHeader.tsx
ConversationList.tsx
```

### Hooks

Use camelCase with `use` prefix:

```text
useAuth.ts
useConversations.ts
useDebounce.ts
```

### Utilities

Use camelCase:

```text
util.ts
dateUtil.ts
formatUtil.ts
```

### API

```text
conversations.api.ts
analytics.api.ts
```

### Types

```text
conversation.types.ts
user.types.ts
```

### Folders

Use lowercase kebab-case:

```text
dashboard/
knowledge-base/
chat-settings/
user-management/
```

Never use inconsistent casing.

---

## 4. Folder Structure

```text
src/
├── components/
│   ├── ui/          # shadcn components
│   ├── layout/      # Sidebar, Header, Layout
│   └── shared/      # reusable application components
│
├── features/
│   ├── dashboard/
│   ├── conversations/
│   ├── analytics/
│   ├── knowledge-base/
│   └── settings/
│
├── pages/            # page-level components
├── hooks/
├── lib/
├── config/
├── types/
├── App.tsx
└── main.tsx
```

### Architecture Rules

- `pages/` contains page-level components.
- `features/` contains feature-specific business logic.
- `components/shared/` contains reusable application components.
- `components/layout/` contains application-wide layout components.
- `components/ui/` contains shadcn primitives.
- Do not put feature-specific business logic directly inside `pages/`.

Example:

```text
pages/
└── Analytics.tsx

features/
└── analytics/
    ├── components/
    ├── hooks/
    ├── api/
    └── types/
```

Pages should primarily compose features.

---

## 5. Code Quality

- Keep code simple and readable.
- Follow DRY.
- Keep components focused.
- Prefer composition over duplication.
- Avoid unnecessary abstractions.
- Avoid unnecessary `useMemo`, `useCallback`, and `useEffect`.
- Avoid unnecessary dependencies.
- Do not refactor unrelated code.
- Make small, focused changes.

---

## 6. TypeScript

- Avoid `any`.
- Prefer `unknown` for unknown data.
- Use strict typing.
- Define clear component props.
- Keep feature-specific types close to the feature.
- Validate external data where appropriate.
- Avoid `@ts-ignore` unless absolutely necessary.

---

## 7. Tailwind & shadcn

Use shadcn for generic UI primitives.

Prefer semantic design tokens:

```tsx
bg - background;
text - foreground;
border - border;
```

Avoid unnecessary hardcoded values:

```tsx
bg-[#ffffff]
rounded-[13px]
px-[23px]
```

Use consistent:

- colors
- spacing
- radius
- shadows
- typography

Customize shadcn components when required instead of creating duplicate primitives.

---

## 8. Forms & API

Use:

```text
React Hook Form + Zod
```

for forms.

Use TanStack Query for server state where appropriate.

Keep API logic outside presentational components:

```text
features/
└── conversations/
    ├── api/
    ├── hooks/
    ├── components/
    └── types/
```

Never rely on client-side validation for security.

---

## 9. Security

Treat all external and user input as untrusted.

- Validate input.
- Sanitize user-generated content.
- Avoid `dangerouslySetInnerHTML`.
- Prevent XSS and injection vulnerabilities.
- Never expose secrets in frontend code.
- Never trust frontend authorization checks.
- Enforce authentication and authorization server-side.
- Use safe parameterized APIs/database queries.
- Validate user-provided URLs and redirects.
- Avoid unnecessary or untrusted dependencies.

Security is more important than convenience.

---

## 10. Accessibility

Use:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible labels
- appropriate ARIA attributes
- sufficient color contrast

Prefer:

```tsx
<button />
```

over:

```tsx
<div onClick={} />
```

---

## 11. Loading & Error States

Async features should handle:

```text
Loading
Success
Empty
Error
```

Use appropriate skeletons, empty states, error messages, and retry actions.

Never silently swallow errors.

---

## 12. Ambiguous Requirements

**Do not guess.**

If the requirement, behavior, UI, API, data structure, or expected result is unclear, ask the user.

Keep asking until the required context is clear.

Do not ask questions that can be answered from:

- `project.md`
- existing code
- established project conventions

---

## 13. Validation

After changes, run relevant checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Only run scripts that exist in the project.

Fix errors before considering the task complete.

---

## Golden Rule

```text
Read project.md
      ↓
Find relevant files
      ↓
Reuse existing code
      ↓
Make the smallest change
      ↓
Keep it simple + secure
      ↓
Validate
      ↓
Update project.md if needed
```

**Do not guess.
Do not over-engineer.
Do not duplicate code.
Do not explore unrelated files.**
