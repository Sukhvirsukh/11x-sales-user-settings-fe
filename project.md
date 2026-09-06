# Project Navigation Map

## Stack

- React 19.2.8 + TypeScript 6.0.2 + Vite 8.2.2
- Tailwind CSS v4.3.3
- shadcn/ui v4.19.0
- @base-ui/react v1.7.0
- Lucide React v1.37.0
- React Router v8.3.1 (browser router)
- TanStack Query v5.102.8 + TanStack Table v9.2.4
- React Hook Form v7.87.0 + Zod v4.5.4 (forms & validation)
- @hookform/resolvers v5.9.1
- Zustand v5.0.15 (state management)
- Inter & Geist fonts
- tw-animate-css v1.4.0
- class-variance-authority v0.7.1

## Project Name

`admin` — Admin dashboard for a chat/AI training platform (brand: Vitalb).

## Routes

| Path | Page Component | Notes |
| ----------------------- | ----------------- | ------------------------- |
| `/` | OverviewPage | Dashboard overview |
| `/contacts` | ContactsPage | Contact management |
| `/conversations` | ConversationsPage | Conversation management |
| `/reports` | ReportsPage | Reports & analytics |
| `/sign-in` | SignInPage | Auth page (outside layout) |
| `/sign-up` | SignUpPage | Registration page (outside layout) |
| `/forgot-password` | ForgotPassword | Password recovery page (outside layout) |
| `/chat-settings` | ChatSettingsPage | Chat configuration |
| `/chat-settings/visibility` | VisibilityPage | Chat visibility settings |
| `/ai-training` | AiTrainingPage | AI training hub (nested routes with index redirect to knowledge-base) |
| `/ai-training/knowledge-base` | KnowledgeBaseTab | Knowledge base management |
| `/ai-training/corrections` | CorrectionsTab | Corrections management |
| `/ai-training/prompt-tools` | PromptToolsTab | Prompt tools management |
| `/ask-me` | AskMePage | Ask me page |
| `/settings` | SettingsPage | Settings page (index redirects to role-n-access) |
| `/settings/role-n-access` | RoleAndAccess | Role & access management |
| `/settings/plan` | Plan | Plan management |
| `/settings/payments` | Payments | Payments management |
| `/settings/store` | Store | Store management |

Protected routes use `AppLayout` (requires `vitalb.jwt` token in localStorage).

## Folder Structure

```
src/
├── components/
│   ├── ui/                          # shadcn primitives
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── field.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── slider.tsx
│   │   ├── spinner.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toggle.tsx
│   │   └── toast.tsx
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
│   │       ├── sideNav.ts           # NAV_ITEMS constant (icon + label + link)
│   │       └── isSidebarHidden.ts   # Sidebar hidden state utility
│   ├── shared/
│   │   ├── StoreDropdown.tsx        # Store selection dropdown
│   │   ├── SectionHeader.tsx        # Section header component
│   │   ├── ActionCard.tsx           # Action card component
│   │   ├── CopyField.tsx            # Copy field component
│   │   ├── PageHeader.tsx           # Page header component
│   │   ├── ErrorDialog.tsx          # Error dialog component
│   │   ├── RootErrorBoundary.tsx    # Root error boundary (wraps app providers)
│   │   ├── chatBox/                 # Reusable chat box component
│   │   │   ├── ChatBox.tsx          # Main chat box container
│   │   │   ├── ChatInput.tsx        # Chat input component
│   │   │   ├── ChatMessage.tsx      # Chat message component
│   │   │   ├── type.ts              # Chat box type definitions
│   │   │   └── index.ts             # Chat box exports
│   │   └── unsavedChangesBar/       # Unsaved changes warning system
│   │       ├── UnSavedChangesBar.tsx # Unsaved changes bar UI
│   │       ├── useUnsavedChangesWarning.ts # Warning hook
│   │       ├── useUnSavedChanges.ts # State hook
│   │       ├── UnsavedChangesDialog.tsx # Confirmation dialog
│   │       └── index.ts             # Exports
│   └── design/                      # Design system components
│       ├── HelperText.tsx           # Helper text component
│       ├── AppCard.tsx              # App card component
│       ├── AppSectoin.tsx           # App section component
│       ├── ColorSelector.tsx        # Color selector component
│       ├── Label.tsx                # Label component
│       ├── TextAreaField.tsx        # Text area field component
│       ├── CustomTabs.tsx           # Custom tabs component
│       ├── ChatBubbleTypeSelector.tsx # Chat bubble type selector
│       ├── SliderField.tsx          # Slider field component
│       ├── GroupRadioField.tsx       # Group radio field component
│       ├── InputField.tsx           # Input field component
│       ├── SelectField.tsx          # Select field component
│       ├── Heading.tsx              # Heading component
│       ├── GroupCheckboxField.tsx   # Group checkbox field component
│       ├── MultiTextField.tsx       # Multi-text field component
│       ├── ImageUploader.tsx        # Image uploader component
│       ├── FormGroup.tsx            # Form group component
│       ├── ToggleField.tsx          # Toggle field component
│       ├── CustomTable.tsx          # Custom table component
│       ├── ExampleTable.tsx         # Example table component
│       └── Modal.tsx                # Modal component
├── features/
│   ├── auth/
│   │   ├── index.ts                 # Auth exports (AuthForm, Background, useAuthStore, authRequest, token helpers, types)
│   │   ├── AuthForm.tsx             # Auth form component
│   │   ├── Background.tsx           # Auth background component
│   │   ├── authTypes.ts            # Auth response, user, store, and form types
│   │   ├── authApi.ts              # Auth requests via shared apiFetch
│   │   ├── authStorage.ts          # JWT storage helpers (vitalb.jwt key)
│   │   └── authStore.ts            # Persisted auth state (Zustand)
│   ├── signIn/
│   │   ├── index.ts                 # Sign-in exports
│   │   ├── SignInForm.tsx           # Sign-in form component
│   │   ├── signInTypes.ts          # Sign-in types inferred from schema
│   │   ├── signInApi.ts            # Sign-in backend request
│   │   └── signInSchema.ts         # Sign-in validation schema (Zod)
│   ├── signUp/
│   │   ├── index.ts                 # Sign-up exports
│   │   ├── SignUpForm.tsx           # Sign-up form component
│   │   ├── signUpTypes.ts          # Sign-up types inferred from schema
│   │   ├── signUpApi.ts            # Sign-up backend request
│   │   └── signUpSchema.ts         # Sign-up validation schema (Zod)
│   ├── forgotPassword/
│   │   ├── index.tsx                # Forgot password exports
│   │   ├── ForgotPasswordForm.tsx   # Forgot password form (react-hook-form + useMutation)
│   │   ├── forgotPasswordSchema.ts  # Forgot password validation schema (Zod)
│   │   ├── forgotPasswordTypes.ts   # Forgot password form types
│   │   └── forgotPasswordApi.ts     # Forgot password API request (apiFetch)
│   ├── dashboard/                   # Empty - feature logic not yet created
│   ├── knowledgeBase/               # Empty - feature logic not yet created
│   ├── visibility/
│   │   ├── index.ts                 # Visibility exports
│   │   ├── visibilityTypes.ts       # Visibility types
│   │   ├── visibilityApi.ts         # Visibility backend request
│   │   ├── visibilityQuery.ts       # TanStack Query hooks and cache key
│   │   ├── AllAccordions.tsx        # All accordions component
│   │   ├── VisibilityFormContext.tsx # Visibility form context
│   │   ├── Visibility.tsx           # Visibility main component
│   │   ├── preview/
│   │   │   ├── Preview.tsx          # Preview component
│   │   │   └── ChatButton.tsx       # Chat button component
│   │   └── fields/
│   │       ├── Position.tsx         # Position field
│   │       ├── LookNFeel.tsx        # Look & feel field
│   │       ├── SocialButton.tsx     # Social button field
│   │       ├── LeadCollection.tsx   # Lead collection field
│   │       └── validations.ts       # Field validation schemas
│   ├── chatSettings/
│   │   ├── Integrations.tsx         # Integrations component
│   │   ├── Channels.tsx             # Channels component
│   │   └── configurations/
│   │       ├── index.tsx            # Configurations exports
│   │       ├── Configurations.tsx   # Main configurations component
│   │       ├── SpamFilter.tsx       # Spam filter settings
│   │       ├── TrackingSettings.tsx # Tracking settings
│   │       ├── CrawlSettings.tsx    # Crawl settings
│   │       └── fieldStyles.ts      # Field styles
│   └── settings/
│       ├── Settings.tsx             # Settings main component
│       ├── index.ts                 # Settings exports
│       ├── roleAndAccess/
│       │   ├── index.ts             # Role & access exports
│       │   ├── RoleAndAccess.tsx    # Role & access main component
│       │   ├── BasicDetails.tsx     # Basic details display
│       │   ├── BasicDetailsForm.tsx # Basic details edit form
│       │   ├── RoleHistory.tsx      # Role history component
│       │   └── Permissions.tsx      # Permissions management
│       ├── plan/
│       │   ├── index.ts             # Plan exports
│       │   └── Plan.tsx             # Plan component
│       ├── payments/
│       │   ├── index.ts             # Payments exports
│       │   └── Payments.tsx         # Payments component
│       └── store/
│           ├── index.ts             # Store exports
│           └── Store.tsx            # Store component
├── pages/                           # Page-level components (compose features)
│   ├── OverviewPage.tsx             # Dashboard overview
│   ├── ContactPage.tsx              # Contact management
│   ├── ConversationsPage.tsx        # Conversation management
│   ├── ReportsPage.tsx              # Reports & analytics
│   ├── SignInPage.tsx               # Sign-in page
│   ├── SignUpPage.tsx               # Sign-up page
│   ├── ForgotPassword.tsx           # Forgot password page (Background + ForgotPasswordForm)
│   ├── AskMePage.tsx                # Ask me page
│   ├── ErrorPage.tsx                # Error page (reuses AppCard + Button for reload/home)
│   ├── SettingsPage.tsx             # Settings page
│   ├── chatSettings/
│   │   ├── ChatSettingsPage.tsx     # Chat settings page
│   │   └── VisibilityPage.tsx       # Chat visibility settings page
│   └── aiTraining/
│       ├── index.tsx                # AI training exports
│       ├── AITrainingPage.tsx       # AI training main page
│       └── tabs/
│           ├── KnowledgeBaseTab.tsx # Knowledge base tab
│           ├── CorrectionsTab.tsx   # Corrections tab
│           └── PromptToolsTab.tsx   # Prompt tools tab
├── hooks/                           # Empty
├── lib/
│   ├── utils.ts                     # cn() (clsx+twMerge), getInitials()
│   ├── api.ts                       # Shared apiFetch wrapper (auth, error handling, toast)
│   └── queryClient.ts              # TanStack Query client
├── config/
│   └── routes.tsx                   # createBrowserRouter definition
├── stores/
│   └── mobileSidebarStore.ts        # Mobile sidebar state management (Zustand)
├── types/                           # Empty
├── assets/
│   ├── hero.png
│   ├── react.svg
│   ├── vite.svg
│   └── sidebar/Icons                # Sidebar navigation icons
├── App.tsx                          # RouterProvider
├── main.tsx                         # React root mount
└── index.css                        # Tailwind v4 imports, CSS variables (design tokens)
```

## Design Tokens (index.css)

Custom CSS variables mapped to Tailwind v4 theme:

- **Backgrounds**: `--background` (#FFF), `--sidebar-bg` (#ffffff), `--card-bg` (#f8fafd), `--card-nested-bg` (#ffffff)
- **Primary**: `--primary` (#3576F3), `--primary-hover` (#236efa), `--primary-foreground` (#ffffff)
- **Borders**: `--border` (#e2e8f0), `--border-subtle` (#edf2f7), `--border-blue` (#dbeafe), `--border-light` (#e6e6e8), `--border-soft` (rgba(0,0,0,0.21)), `--border-strong` (#c7c7cc)
- **Text**: `--foreground` (#0f172a), `--muted-foreground` (#64748b), `--label-text` (#94a3b8)
- **Active states**: `--active-item-bg` (#f0f7ff), `--active-item-border` (#dbeafe), `--active-tab-bg` (#ffffff), `--active-tab-border` (#e2e8f0)
- **Badges**: `--badge-active-bg` (#CDFEE1), `--badge-active-text` (#166534), `--badge-active-dot` (#16a34a), `--badge-inactive-bg` (#FFDBDB)
- **Status**: `--status-online` (#D1EFC0), `--danger` (#FF7B7E), `--success` (#47941E)
- **Muted**: `--muted` (#F1F1F1), `--light-gray` (#F7F7F7)
- **Secondary**: `--secondary-button-bg` (#e2e8f0), `--secondary-button-hover` (#cbd5e1)
- **Chat**: `--chat-bg` (#EEEEEE)
- **Shadows**: `--shadow-blue`, `--shadow-auth`, `--shadow-panel`

Use these tokens via Tailwind classes (e.g. `bg-background`, `text-primary`, `border-border-subtle`) rather than hardcoded hex values.

## Navigation Items

Defined in `src/components/layout/sidebar/sideNav.ts`:

1. Overview (`/`) — OverviewIcon
2. Contacts (`/contacts`) — ContactsIcon
3. Conversations (`/conversations`) — ConversationsIcon
4. Reports (`/reports`) — ReportsIcon
5. Chat configure (`/chat-settings`) — ChatConfigurationIcon
6. AI training (`/ai-training`) — AiTrainingIcon
7. Settings (`/settings`) — SettingsIcon
8. Ask me (`/ask-me`) — AskMeIcon

## Architecture Notes

- `ErrorPage` reuses `AppCard` and `Button` for reload/home recovery. The router's root `errorElement` handles route errors, and `RootErrorBoundary` wraps the app providers to catch rendering failures outside routes.
- The persisted auth store (`src/features/auth/authStore.ts`) exposes `user`, `name`, `email`, and `role`. Sign-in and sign-up populate these through `setUser`; `authApi.ts` reads the role from the backend's `user.role` field.
- Auth token is stored as `vitalb.jwt` in localStorage via helpers in `authStorage.ts` (not `authToken`).
- All API requests use `VITE_AUTH_API_BASE_URL` from the root `.env` file via the shared `apiFetch` wrapper (`src/lib/api.ts`). The wrapper automatically attaches Bearer tokens and surfaces errors via toast. Restart the Vite dev server after changing env vars.
- Path alias `@/*` maps to `./src/*` (defined in `tsconfig.json` and `tsconfig.app.json`).
- **Pages** are thin wrappers — they should compose feature-specific components, not contain business logic.
- **Features** contain domain-specific logic organized as `components/`, `hooks/`, `api/`, `types/`.
- **Components** are split into `ui/` (shadcn primitives), `layout/` (app shell), `shared/` (reusable app components), `design/` (design system components).
- The sidebar supports both desktop (collapsible, `w-[187px]` ↔ `w-[72px]`) and mobile (full-screen overlay).
- Auth check uses `localStorage.getItem("vitalb.jwt")` with a hardcoded `true` fallback (dev mode).
- Zustand is used for mobile sidebar state management (`src/stores/mobileSidebarStore.ts`).
- AI Training page uses nested routes with tabs for knowledge base, corrections, and prompt tools. The index route redirects to `knowledge-base`.
- Chat Settings page includes integrations, channels, configuration, and visibility sub-routes.
- Settings page uses nested routes for role-n-access, plan, payments, and store management. The index route redirects to `role-n-access`.
- The `unsavedChangesBar` shared component provides a warning system for unsaved changes.
- `forgotPassword` feature uses TanStack Query for password reset mutations.

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
- Use `apiFetch` from `src/lib/api.ts` for all API calls (handles auth, errors, toasts).
