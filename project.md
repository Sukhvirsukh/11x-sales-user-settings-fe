# Project Navigation Map

## Stack

- React 19.2.8 + TypeScript 6.0.2 + Vite 8.2.2
- Tailwind CSS v4.3.3
- shadcn/ui v4.19.0
- Lucide React v1.37.0
- React Router v8.3.1 (browser router)
- TanStack Query v5.102.8
- React Hook Form v7.87.0 + Zod v4.5.4 (forms & validation)
- Zustand v5.0.15 (state management)
- Inter & Geist fonts

## Project Name

`admin` — Admin dashboard for a chat/AI training platform (brand: Vitalb).

## Routes

| Path                    | Page Component    | Notes                     |
| ----------------------- | ----------------- | ------------------------- |
| `/`                     | OverviewPage      | Dashboard overview        |
| `/contacts`             | ContactsPage      | Contact management        |
| `/conversations`        | ConversationsPage | Conversation management   |
| `/reports`              | ReportsPage       | Reports & analytics       |
| `/sign-in`              | SignIn            | Auth page (outside layout)|
| `/sign-up`              | SignUpPage        | Registration page (outside layout)|
| `/chat-settings`        | ChatSettingsPage  | Chat configuration        |
| `/ai-training`          | AiTrainingPage    | AI training hub with tabs |
| `/ai-training/knowledge-base` | KnowledgeBaseTab | Knowledge base management |
| `/ai-training/corrections` | CorrectionsTab | Corrections management |
| `/ai-training/prompt-tools` | PromptToolsTab | Prompt tools management |

Protected routes use `AppLayout` (requires `authToken` in localStorage).

## Folder Structure

```
src/
├── components/
│   ├── ui/                          # shadcn primitives
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   └── input.tsx
│   ├── layout/
│   │   ├── AppLayou.tsx             # Root layout (auth guard + Sidebar + Outlet)
│   │   ├── Header.tsx               # Header component
│   │   ├── PageContainer.tsx        # Page container wrapper
│   │   ├── MobileTopbar.tsx         # Mobile top bar
│   │   └── sidebar/
│   │       ├── index.tsx            # Sidebar (renders Desktop + Mobile)
│   │       ├── DesktopSidebar.tsx   # Collapsible desktop sidebar
│   │       ├── MobileSidebar.tsx    # Full-screen mobile sidebar overlay
│   │       ├── SidebarUserCard.tsx  # User profile card at bottom of sidebar
│   │       └── sideNav.ts           # NAV_ITEMS constant (icon + label + link)
│   ├── shared/
│   │   ├── StoreDropdown.tsx        # Store selection dropdown
│   │   ├── SectionHeader.tsx        # Section header component
│   │   ├── ActionCard.tsx           # Action card component
│   │   ├── CopyField.tsx            # Copy field component
│   │   └── PageHeader.tsx           # Page header component
│   └── design/
│       ├── HelperText.tsx           # Helper text component
│       ├── AppCard.tsx              # App card component
│       ├── Label.tsx                # Label component
│       ├── CustomTabs.tsx           # Custom tabs component
│       ├── InputField.tsx           # Input field component
│       ├── Heading.tsx              # Heading component
│       └── MultiTextField.tsx       # Multi-text field component
├── features/
│   ├── auth/
│   │   ├── index.tsx                # Auth exports
│   │   └── AuthForm.tsx             # Auth form component
│   ├── sign-in/
│   │   ├── index.ts                 # Sign-in exports
│   │   ├── SignInForm.tsx           # Sign-in form component
│   │   └── schema.ts               # Sign-in validation schema
│   ├── sign-up/
│   │   ├── index.ts                 # Sign-up exports
│   │   ├── SignUpForm.tsx           # Sign-up form component
│   │   └── schema.ts               # Sign-up validation schema
│   ├── dashboard/                   # Empty - feature logic not yet created
│   ├── knowledge-base/              # Empty - feature logic not yet created
│   └── chat-settings/
│       ├── Integrations.tsx         # Integrations component
│       ├── Channels.tsx             # Channels component
│       └── configurations/
│           ├── index.tsx            # Configurations exports
│           ├── Configurations.tsx   # Main configurations component
│           ├── SpamFilter.tsx       # Spam filter settings
│           ├── TrackingSettings.tsx # Tracking settings
│           ├── CrawlSettings.tsx    # Crawl settings
│           └── fieldStyles.ts      # Field styles
├── pages/                           # Page-level components (compose features)
│   ├── OverviewPage.tsx             # Dashboard overview
│   ├── ContactPage.tsx              # Contact management
│   ├── ConversationsPage.tsx        # Conversation management
│   ├── ReportsPage.tsx              # Reports & analytics
│   ├── SignIn.tsx                   # Sign-in page
│   ├── SignUpPage.tsx               # Sign-up page
│   ├── SignInPage.tsx               # Sign-in page variant
│   ├── chat-settings/
│   │   └── ChatSettingsPage.tsx     # Chat settings page
│   └── ai-training/
│       ├── index.tsx                # AI training exports
│       ├── AITrainingPage.tsx       # AI training main page
│       └── tabs/
│           ├── KnowledgeBaseTab.tsx # Knowledge base tab
│           ├── CorrectionsTab.tsx   # Corrections tab
│           └── PromptToolsTab.tsx   # Prompt tools tab
├── hooks/                           # Empty
├── lib/
│   ├── utils.ts                     # cn() (clsx+twMerge), getInitials()
│   └── queryClient.ts              # Empty - TanStack Query client not yet configured
├── config/
│   └── routes.tsx                   # createBrowserRouter definition
├── stores/
│   └── mobileSidebarStore.ts        # Mobile sidebar state management
├── types/                           # Empty
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── App.tsx                          # RouterProvider
├── main.tsx                         # React root mount
└── index.css                        # Tailwind v4 imports, CSS variables (design tokens)
```

## Design Tokens (index.css)

Custom CSS variables mapped to Tailwind v4 theme:

- **Backgrounds**: `--background` (#f8fafc), `--sidebar-bg` (#ffffff), `--card-bg` (#f8fafd)
- **Primary**: `--primary` (#2563eb blue), `--primary-hover` (#1d4ed8)
- **Borders**: `--border` (#e2e8f0), `--border-subtle` (#edf2f7), `--border-blue` (#dbeafe)
- **Text**: `--foreground` (#0f172a), `--muted-foreground` (#64748b), `--label-text` (#94a3b8)
- **Active states**: `--active-item-bg` (#f0f7ff), `--active-item-border` (#dbeafe)
- **Badges**: `--badge-active-bg` (#e6f4ea), `--badge-active-text` (#166534), `--badge-active-dot` (#16a34a)

Use these tokens via Tailwind classes (e.g. `bg-background`, `text-primary`, `border-border-subtle`) rather than hardcoded hex values.

## Navigation Items

Defined in `src/components/layout/sidebar/sideNav.ts`:

1. Overview (`/`) — LayoutGrid icon
2. Contacts (`/contacts`) — Phone icon
3. Conversations (`/conversations`) — MessageSquarePlus icon
4. Reports (`/reports`) — MessagesSquare icon
5. Chat configure (`/chat-settings`) — MonitorCog icon
6. AI training (`/ai-training`) — Sparkles icon
7. Settings (`/settings`) — Settings icon
8. Ask me (`/ask-me`) — MousePointerClick icon

## Architecture Notes

- **Pages** are thin wrappers — they should compose feature-specific components, not contain business logic.
- **Features** contain domain-specific logic organized as `components/`, `hooks/`, `api/`, `types/`.
- **Components** are split into `ui/` (shadcn primitives), `layout/` (app shell), `shared/` (reusable app components), `design/` (design system components).
- Most pages and shared components are currently **stubs** — implementation is pending.
- The sidebar supports both desktop (collapsible, `w-[187px]` ↔ `w-[72px]`) and mobile (full-screen overlay).
- Auth check uses `localStorage.getItem("authToken")` with a hardcoded `true` fallback (dev mode).
- Zustand is used for mobile sidebar state management (`src/stores/mobileSidebarStore.ts`).
- AI Training page uses nested routes with tabs for knowledge base, corrections, and prompt tools.
- Chat Settings page includes integrations, channels, and configuration components.

## Key Conventions

- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.
- Prefer semantic design tokens (`bg-background`, `text-primary`) over hardcoded colors.
- Use PascalCase for components, camelCase with `use` prefix for hooks.
- Use kebab-case for folder names.
- Route definitions live in `src/config/routes.tsx`.
- All shadcn UI primitives go in `src/components/ui/`.
- Design system components go in `src/components/design/`.
- Feature-specific business logic goes in `src/features/`.
- Pages compose features and should not contain business logic directly.
