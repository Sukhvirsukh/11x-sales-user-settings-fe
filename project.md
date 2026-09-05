# Project Navigation Map

## Stack

- React 19.2.8 + TypeScript 6.0.2 + Vite 8.2.2
- Tailwind CSS v4.3.3
- shadcn/ui v4.19.0
- @base-ui/react v1.7.0
- Lucide React v1.37.0
- React Router v8.3.1 (browser router)
- TanStack Query v5.102.8
- React Hook Form v7.87.0 + Zod v4.5.4 (forms & validation)
- Zustand v5.0.15 (state management)
- Inter & Geist fonts
- tw-animate-css v1.4.0

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
| `/chat-settings` | ChatSettingsPage | Chat configuration |
| `/chat-settings/visibility` | VisibilityPage | Chat visibility settings |
| `/ai-training` | AiTrainingPage | AI training hub with tabs |
| `/ai-training/knowledge-base` | KnowledgeBaseTab | Knowledge base management |
| `/ai-training/corrections` | CorrectionsTab | Corrections management |
| `/ai-training/prompt-tools` | PromptToolsTab | Prompt tools management |
| `/ask-me` | AskMePage | Ask me page |
| `/settings` | SettingsPage | Settings page (nested routes) |
| `/settings/role-n-access` | RoleAndAccess | Role & access management |
| `/settings/plan` | Plan | Plan management |
| `/settings/payments` | Payments | Payments management |
| `/settings/store` | Store | Store management |

Protected routes use `AppLayout` (requires `authToken` in localStorage).

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
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── slider.tsx
│   │   ├── spinner.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
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
│       └── FormGroup.tsx            # Form group component
├── features/
│   ├── auth/
│   │   ├── index.tsx                # Auth exports
│   │   ├── AuthForm.tsx             # Auth form component
│   │   ├── Background.tsx           # Auth background component
│   │   ├── mockAuthApi.ts           # Mock auth API for development
│   │   └── storeAuth.ts            # Auth state management
│   ├── signIn/
│   │   ├── index.ts                 # Sign-in exports
│   │   ├── SignInForm.tsx           # Sign-in form component
│   │   └── schema.ts               # Sign-in validation schema
│   ├── signUp/
│   │   ├── index.ts                 # Sign-up exports
│   │   ├── SignUpForm.tsx           # Sign-up form component
│   │   └── schema.ts               # Sign-up validation schema
│   ├── dashboard/                   # Empty - feature logic not yet created
│   ├── knowledgeBase/               # Empty - feature logic not yet created
│   ├── chatbox/                     # Empty - feature logic not yet created
│   ├── visibility/
│   │   ├── AllAccordions.tsx        # All accordions component
│   │   ├── VisibilityFormContext.tsx # Visibility form context
│   │   ├── Visibility.tsx           # Visibility main component
│   │   ├── preview/
│   │   │   ├── Preview.tsx          # Preview component
│   │   │   └── ChatButton.tsx       # Chat button component
│   │   ├── fields/
│   │   │   ├── Position.tsx         # Position field
│   │   │   ├── LookNFeel.tsx        # Look & feel field
│   │   │   ├── SocialButton.tsx     # Social button field
│   │   │   ├── LeadCollection.tsx   # Lead collection field
│   │   │   └── validations.ts      # Field validation schemas
│   │   └── queries/
│   │       └── visibilityQuery.ts   # Visibility API queries
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
│       │   ├── index.ts            # Role & access exports
│       │   ├── RoleAndAccess.tsx   # Role & access component
│       │   └── BasicDetails.tsx    # Basic details component
│       ├── plan/
│       │   ├── index.ts            # Plan exports
│       │   └── Plan.tsx            # Plan component
│       ├── payments/
│       │   ├── index.ts            # Payments exports
│       │   └── Payments.tsx        # Payments component
│       └── store/
│           ├── index.ts            # Store exports
│           └── Store.tsx           # Store component
├── pages/                           # Page-level components (compose features)
│   ├── OverviewPage.tsx             # Dashboard overview
│   ├── ContactPage.tsx              # Contact management
│   ├── ConversationsPage.tsx        # Conversation management
│   ├── ReportsPage.tsx              # Reports & analytics
│   ├── SignInPage.tsx               # Sign-in page
│   ├── SignUpPage.tsx               # Sign-up page
│   ├── AskMePage.tsx                # Ask me page
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

- Authentication requests use `VITE_AUTH_API_BASE_URL` from the root `.env` file. Restart the Vite dev server after changing it.
- **Pages** are thin wrappers — they should compose feature-specific components, not contain business logic.
- **Features** contain domain-specific logic organized as `components/`, `hooks/`, `api/`, `types/`.
- **Components** are split into `ui/` (shadcn primitives), `layout/` (app shell), `shared/` (reusable app components), `design/` (design system components).
- Most pages and shared components are currently **stubs** — implementation is pending.
- The sidebar supports both desktop (collapsible, `w-[187px]` ↔ `w-[72px]`) and mobile (full-screen overlay).
- Auth check uses `localStorage.getItem("authToken")` with a hardcoded `true` fallback (dev mode).
- Zustand is used for mobile sidebar state management (`src/stores/mobileSidebarStore.ts`).
- AI Training page uses nested routes with tabs for knowledge base, corrections, and prompt tools.
- Chat Settings page includes integrations, channels, configuration, and visibility sub-routes.
- Settings page uses nested routes for role-n-access, plan, payments, and store management.
- The `unsavedChangesBar` shared component provides a warning system for unsaved changes.

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
