# Project Navigation Map

## Stack

- React 19.2.8 + TypeScript 6.0.2 + Vite 8.2.2
- Tailwind CSS v4.3.3
- shadcn/ui v4.19.0
- @base-ui/react v1.7.0
- Lucide React v1.37.0
- React Router v8.3.1 (browser router, lazy-loaded routes)
- TanStack Query v5.102.8
- TanStack Table v9.2.4
- Recharts v3.10.1 (charts on Overview / Reports)
- React Hook Form v7.87.0 + Zod v4.5.4 (forms & validation)
- @hookform/resolvers v5.9.1
- Zustand v5.0.15 (state management)
- date-fns v4.4.0 + react-day-picker v10.0.1 (date picker)
- @fontsource-variable/inter + @fontsource-variable/geist (fonts)
- tw-animate-css v1.4.0
- class-variance-authority v0.7.1

## Project Name

`admin` — Admin dashboard for a chat/AI training platform (brand: Vitalb).

## Routes

Defined in `src/config/routes.tsx` (`createBrowserRouter`, all pages lazy-loaded except `ErrorPage`).

| Path | Page / Component | Notes |
| ------------------------------- | ----------------- | ------------------------- |
| `/` | OverviewPage | Dashboard overview |
| `/contacts` | ContactPage | Parent route with tabbed `Outlet`; index redirects to `user-profile-details` |
| `/contacts/user-profile-details` | UserProfileDetails | User profiles tab |
| `/contacts/segaments` | Segaments | Segaments tab |
| `/conversations` | ConversationsPage | Parent route with tabbed `Outlet`; index redirects to `active-chats` |
| `/conversations/active-chats` | ActiveChat | Active chats tab |
| `/conversations/escalated` | Escalated | Escalated chats tab |
| `/conversations/assigned-to-me` | AssignedToMe | Chats assigned to me tab |
| `/conversations/archived` | Archived | Archived chats tab |
| `/reports` | ReportsPage | Reports & analytics |
| `/sign-in` | SignInPage | Auth page (outside layout) |
| `/sign-up` | SignUpPage | Registration page (outside layout) |
| `/forgot-password` | ForgotPassword | Password recovery page (outside layout) |
| `/reset-password?token=…` | ResetPasswordPage | Token-based password reset page (outside layout) |
| `/chat-settings` | ChatSettingsPage | Chat configuration (accordion) |
| `/chat-settings/visibility` | VisibilityPage | Chat visibility settings |
| `/ai-training` | AiTrainingPage | AI training hub (nested tabs; index redirects to `knowledge-base`) |
| `/ai-training/knowledge-base` | KnowledgeBaseTab | Knowledge base management |
| `/ai-training/corrections` | CorrectionsTab | Corrections management |
| `/ai-training/prompt-tools` | PromptToolsTab | Prompt tools management |
| `/ask-me` | AskMePage | Ask me page (AI chat assistant) |
| `/settings` | SettingsPage | Settings hub (nested tabs; index redirects to `role-n-access`) |
| `/settings/role-n-access` | RoleAndAccess | Role & access management |
| `/settings/plan` | Plan | Plan management |
| `/settings/payments` | Payments | Payments management |
| `/settings/store` | Store | Store management |
| `*` | NotFoundPage | Catch-all 404, rendered inside `AppLayout` |

`AppLayout` wraps all protected routes; the `/sign-in`, `/sign-up`, and `/forgot-password` routes sit outside it. The router root has `errorElement: <ErrorPage />`.

Inside `AppLayout` every protected page renders through `RouteGuard`, which is the single enforcement point for access:

- A route declares the capability it needs in `handle: { permission: "…" } ` (typed with `satisfies RouteHandle`), e.g. `{ path: "plan", element: <Plan />, handle: { permission: "settings.plan.view" } }`.
- `RouteGuard` reads `useMatches()`, takes the **deepest** match that declares a permission (so a parent's declaration covers its children), and checks it against the signed-in role. Routes without a `handle` (the `*` catch-all) stay open to every signed-in user.
- A blocked visit redirects to the role's own home route. If that home is itself blocked (unknown role, misconfigured policy) `ForbiddenPage` (403) renders instead, so a blocked route can never bounce or loop.

Route entries therefore name **capabilities, never roles** — the grants themselves come from the backend, and `src/features/auth/permissions.ts` only declares the catalog of sections/actions the UI can render and check.

## Folder Structure

```text
src/
├── components/
│   ├── ui/                          # shadcn primitives
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx             # Calendar (react-day-picker), used by DatePicker
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── field.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx             # used by TableSkeleton
│   │   ├── slider.tsx
│   │   ├── spinner.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── toggle.tsx
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
│   ├── shared/                      # reusable application components
│   │   ├── StoreDropdown.tsx        # Store selection dropdown
│   │   ├── SectionHeader.tsx        # Section header component
│   │   ├── ActionCard.tsx           # Action card component
│   │   ├── CopyField.tsx            # Copy field component
│   │   ├── PageHeader.tsx           # Page header component (title/subtitle + children)
│   │   ├── ErrorDialog.tsx          # Error dialog component
│   │   ├── RootErrorBoundary.tsx    # Root error boundary (wraps app providers)
│   │   ├── OverviewCard.tsx         # Metric card (title, numbers, icon)
│   │   ├── SearchField.tsx          # Responsive search input (popover on mobile)
│   │   ├── chatBox/                 # Reusable chat box component
│   │   │   ├── ChatBox.tsx          # Loaded chat box; optional default messages and product recommendations
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx      # User/bot bubble + bot action row (Debug / Make correction / thumbs / ✓)
│   │   │   ├── ProductRecommendation.tsx # Product row rendered inside a bot message
│   │   │   ├── type.ts
│   │   │   └── index.ts
│   │   ├── conversations/           # Conversations page UI
│   │   │   ├── conversationData.ts  # Conversation + message + filter-group fixtures
│   │   │   ├── ConversationsChatPannel.tsx # Chat panel: list | thread | customer details
│   │   │   ├── ConversationsFilter.tsx     # Filter sidebar
│   │   │   └── index.ts
│   │   ├── skeletons/
│   │   │   └── TableSkeletons.tsx   # TableSkeleton (columns/rows/showHeader)
│   │   └── unsavedChangesBar/       # Unsaved changes warning system
│   │       ├── UnSavedChangesBar.tsx
│   │       ├── useUnsavedChangesWarning.ts
│   │       ├── useUnSavedChanges.ts
│   │       ├── UnsavedChangesDialog.tsx
│   │       └── index.ts
│   └── design/                      # design system components
│       ├── AppCard.tsx              # App card component
│       ├── AppSectoin.tsx           # App section component (note existing typo in name)
│       ├── Banner.tsx               # Banner (variants: success, destructive, info, warning)
│       ├── ChatBubbleTypeSelector.tsx
│       ├── ColorSelector.tsx
│       ├── CustomTable.tsx          # Table (columns/data/headerActions/rowActions/bulkActions/pagination)
│       ├── CustomTabs.tsx           # Custom tabs component
│       ├── DatePicker.tsx           # Date picker (Calendar + Popover, date-fns)
│       ├── DetailContainer.tsx      # DetailContainer / DetailGroup / DetailItem
│       ├── DetailContainer.module.css
│       ├── FormGroup.tsx
│       ├── GroupCheckboxField.tsx
│       ├── GroupRadioField.tsx
│       ├── Heading.tsx              # Heading (CVA: 2xl, xlg, lg, md)
│       ├── HelperText.tsx
│       ├── ImageUploader.tsx
│       ├── InputField.tsx
│       ├── Label.tsx
│       ├── Modal.tsx                # Dialog wrapper (trigger/title/primary/secondary/close)
│       ├── MultiTextField.tsx
│       ├── PreviewSection.tsx       # White card wrapper (shadow-blue)
│       ├── SelectField.tsx
│       ├── SliderField.tsx
│       ├── TextAreaField.tsx
│       └── ToggleField.tsx
├── features/
│   ├── ai-training/                 # NOTE: kebab-case folder
│   │   ├── corrections/
│   │   │   ├── Corrections.tsx
│   │   │   └── index.ts
│   │   ├── knowledgeBase/
│   │   │   ├── KnowledgeBase.tsx    # Table + search (CustomTable, TableSkeleton)
│   │   │   ├── AddKnowledge.tsx
│   │   │   ├── DeleteKnowledgeBase.tsx
│   │   │   ├── knowledgeBaseApi.ts
│   │   │   ├── useKnowledgeBaseQuery.ts # TanStack Query hooks
│   │   │   ├── knowledgeBaseSchema.ts
│   │   │   ├── knowledgeBaseTypes.ts
│   │   │   └── index.ts
│   │   └── promptTools/
│   │       ├── PromptTools.tsx
│   │       └── index.ts
│   ├── askAi/
│   │   ├── AskAI.tsx                # Chat area + history banner
│   │   ├── AskAIChat.tsx            # Chat interface (messages, input, file attachment)
│   │   └── index.ts
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   ├── Background.tsx           # Decorative SVG auth background
│   │   ├── RouteGuard.tsx           # Route-level access enforcement (reads handle.permission)
│   │   ├── authApi.ts               # Auth requests via shared apiFetch
│   │   ├── authStorage.ts           # JWT storage helpers (vitalb.jwt key)
│   │   ├── authStore.ts             # In-memory auth state (Zustand)
│   │   ├── authTypes.ts             # AuthResponse, AuthUser, AuthApiUser, store, form types
│   │   ├── permissionSchema.ts      # Zod schemas + types for the permissions payload
│   │   ├── permissions.ts           # Permission catalog + parse / payload helpers
│   │   ├── permissionsDefaultData.ts # Per-role default grants (temporary fallback)
│   │   ├── usePermissions.ts        # usePermissions / useCan hooks
│   │   └── index.ts
│   ├── chatSettings/
│   │   ├── Channels.tsx             # Channel cards + visibility link
│   │   ├── Integrations.tsx         # Integrations cards (TanStack Query)
│   │   ├── chatSettingsApi.ts       # getIntegrations, getConfigurations, saveConfigurations, getIntervals
│   │   ├── chatSettingsQuery.ts     # useIntegrationsQuery / useConfigurationsQuery / useIntervalsQuery + keys
│   │   ├── chatSettingsType.ts      # IntegrationResponse, Configuration types
│   │   └── configurations/
│   │       ├── Configurations.tsx
│   │       ├── SpamFilter.tsx
│   │       ├── TrackingSettings.tsx
│   │       ├── CrawlSettings.tsx
│   │       ├── configurationsSchema.ts
│   │       └── index.tsx
│   ├── contacts/
│   │   ├── UserProfileDetails.tsx   # User profiles table (CustomTable) + search + delete
│   │   ├── Segaments.tsx            # Segaments table (CustomTable) + search + delete + Add segament
│   │   ├── AddSegament.tsx          # Add-only modal (name + Active schedule date)
│   │   ├── DeleteContacts.tsx       # Shared delete modal (kind: "segament" | "userProfile")
│   │   ├── contactsApi.ts           # get/create/delete user profiles + segaments (mock delay)
│   │   ├── contactQuery.ts          # useUserProfilesQuery / useSegamentsQuery + query keys
│   │   ├── contactSchema.ts         # segamentFormSchema (zod)
│   │   ├── contactType.ts           # UserProfile, Segament, SegamentStatus, SegamentFormValues
│   │   └── mockContacts.ts          # userProfiles / segaments fixtures
│   ├── conversations/
│   │   ├── activeChats/             # ActiveChat (renders ConversationsChatPannel)
│   │   ├── archived/                # Archived
│   │   ├── assignedToMe/            # AssignedToMe
│   │   ├── escalated/               # Escalated
│   │   ├── conversationFilterStore.ts  # Zustand filter state (searchQuery, selectedFilters)
│   │   └── conversationsFilterStore.ts # (empty placeholder — superseded by above)
│   ├── forgotPassword/
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── forgotPasswordQueries.ts # TanStack Query mutations
│   │   └── index.tsx
│   ├── resetPassword/               # Token-based password reset form, schema, and API
│   ├── overview/
│   │   ├── Overview.tsx             # Dashboard grid (metrics + charts + widgets)
│   │   ├── overviewApi.ts           # (empty placeholder)
│   │   ├── overviewType.ts
│   │   ├── components/
│   │   │   ├── ActionTrend.tsx
│   │   │   ├── AverageOrderValue.tsx
│   │   │   ├── ChatToSaleChart.tsx
│   │   │   ├── KnowMore.tsx
│   │   │   ├── PerformanceMatrix.tsx
│   │   │   ├── SetupProgress.tsx
│   │   │   ├── SystemStatus.tsx
│   │   │   └── Tips.tsx
│   │   └── index.ts
│   ├── reports/
│   │   ├── Reports.tsx              # Reports table (CustomTable)
│   │   ├── GenerateReport.tsx
│   │   ├── reportApi.ts             # Fixture data + simulated delay
│   │   ├── reportQuery.ts           # useReportQuery
│   │   ├── reportSchema.ts
│   │   ├── reportType.ts
│   │   └── index.ts
│   ├── settings/
│   │   ├── payments/
│   │   │   ├── Payments.tsx         # Renders history + saved details
│   │   │   ├── PaymentHistory.tsx   # Invoices table (CustomTable)
│   │   │   ├── AddNewPayment.tsx    # "Add payment" modal (Account/Card tabs)
│   │   │   ├── SavedPaymentDetails.tsx
│   │   │   └── index.ts
│   │   ├── plan/
│   │   │   ├── Plan.tsx
│   │   │   ├── Plan.module.css
│   │   │   ├── planApi.ts           # getPlans, upgradePlan
│   │   │   ├── planQuery.ts
│   │   │   ├── planTypes.ts
│   │   │   └── index.ts
│   │   ├── roleAndAccess/
│   │   │   ├── RoleAndAccess.tsx    # BasicDetails + RoleHistory (gated by settings.roles.view)
│   │   │   ├── basicDetails/
│   │   │   │   ├── BasicDetails.tsx
│   │   │   │   ├── BasicDetailsForm.tsx
│   │   │   │   ├── basicDetailsApi.ts   # updateProfile (PATCH /auth/profile)
│   │   │   │   ├── basicDetailsSchema.ts
│   │   │   │   ├── basicDetailsTypes.ts
│   │   │   │   └── index.ts
│   │   │   ├── roleHistory/
│   │   │   │   ├── Permissions.tsx  # Permission matrix (CustomTable)
│   │   │   │   ├── RoleHistory.tsx  # Roles table (CustomTable) + search + Add role
│   │   │   │   ├── AddRoleForm.tsx
│   │   │   │   ├── DeleteRole.tsx
│   │   │   │   ├── roleHistoryApi.ts
│   │   │   │   ├── roleHistoryQuery.ts
│   │   │   │   ├── roleHistorySchema.ts
│   │   │   │   ├── roleHistoryType.ts # Role API response/payload, table-row, and form types
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── store/
│   │       ├── Store.tsx
│   │       ├── AddStore.tsx         # "Add store" modal form
│   │       ├── DeleteStore.tsx
│   │       ├── storeApi.ts          # get/create/update/delete/bulk-delete stores
│   │       ├── storeQuery.ts
│   │       ├── storeSchema.ts
│   │       ├── storeType.ts
│   │       └── index.ts
│   ├── signIn/
│   │   ├── SignInForm.tsx
│   │   ├── signInApi.ts
│   │   ├── signInSchema.ts
│   │   ├── signInTypes.ts
│   │   └── index.ts
│   ├── signUp/
│   │   ├── SignUpForm.tsx
│   │   ├── signUpApi.ts
│   │   ├── signUpSchema.ts
│   │   ├── signUpTypes.ts
│   │   └── index.ts
│   └── visibility/
│       ├── Visibility.tsx
│       ├── AllAccordions.tsx
│       ├── VisibilityFormContext.tsx
│       ├── visibilityApi.ts
│       ├── visibilityQuery.ts
│       ├── visibilityTypes.ts
│       ├── index.ts
│       ├── preview/
│       │   ├── Preview.tsx
│       │   └── ChatButton.tsx
│       └── fields/
│           ├── Position.tsx
│           ├── LookNFeel.tsx
│           ├── SocialButton.tsx
│           ├── LeadCollection.tsx
│           └── validations.ts
├── pages/                           # Page-level components (compose features)
│   ├── OverviewPage.tsx
│   ├── ContactPage.tsx              # Tabs + Outlet (user profile details / segaments)
│   ├── ConversationsPage.tsx        # Tabs + Outlet + ConversationsFilter
│   ├── ReportsPage.tsx
│   ├── SignInPage.tsx
│   ├── SignUpPage.tsx
│   ├── ForgotPassword.tsx
│   ├── AskMePage.tsx
│   ├── ErrorPage.tsx                # Reuses AppCard + Button for reload/home
│   ├── ForbiddenPage.tsx            # 403 shown by RouteGuard when no redirect would help
│   ├── NotFoundPage.tsx             # Catch-all 404 (big 404 + nav shortcuts)
│   ├── SettingsPage.tsx             # Tabs + Outlet
│   ├── chatSettings/
│   │   ├── ChatSettingsPage.tsx
│   │   └── VisibilityPage.tsx
│   └── aiTraining/
│       ├── index.tsx                # Exports AiTrainingPage
│       ├── AITrainingPage.tsx       # Tabs + Outlet
│       └── tabs/
│           ├── KnowledgeBaseTab.tsx
│           ├── CorrectionsTab.tsx
│           └── PromptToolsTab.tsx
├── lib/
│   ├── utils.ts                     # cn(), delay(), getInitials(), debounce(), dateFormater()
│   ├── api.ts                       # Shared apiFetch wrapper (auth, errors, toast)
│   └── queryClient.ts               # TanStack Query client
├── config/
│   └── routes.tsx                   # createBrowserRouter definition
├── stores/
│   └── mobileSidebarStore.ts        # Mobile sidebar state (Zustand)
├── assets/
│   ├── hero.png
│   ├── react.svg
│   ├── vite.svg
│   ├── auth/                        # background.png, social icons (google/shopify/facebook), empty Background.tsx leftover
│   ├── integrations/                # shopify.svg, backend.svg
│   ├── chatSettings/                # preview-background.png
│   └── sidebar/
│       └── Icons.tsx                # Sidebar navigation icons
├── App.tsx                          # Suspense + RouterProvider
├── main.tsx                         # React root mount (RootErrorBoundary > QueryClientProvider > Toaster > App)
└── index.css                        # Tailwind v4 imports, CSS variables (design tokens, light + dark)
```

## Design Tokens (index.css)

Imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the Inter variable font. A `@custom-variant dark (&:where(.dark, .dark *))` restricts `dark:` utilities to a `.dark` class (OS `prefers-color-scheme` dark mode is disabled).

Theme values are defined twice: `:root` (light) and `.dark` (dark palette). Tokens are mapped into Tailwind's `@theme` so they're usable as utilities.

- **Font scale**: custom `--text-*` sizes — xs 10px, sm 12px, base 14px, lg 16px, xl 18px, 2xl 20px, 3xl 24px (with custom line heights). Body defaults to 14px Inter (`--font-sans`); `--font-geist` is also declared.
- **Surfaces**: `--background` (#FFF), `--popover` (#FFF), `--sidebar-bg` (#ffffff), `--surface-raised` (#ffffff), `--surface-subtle` (#F7F8FB), `--muted` (#F1F1F1). The three primary container primitives have dedicated layers: `--preview-section-background` (#FFF), `--app-section-background` (the pale blue section tint), and `--app-card-background` (#FFF). The visibility editor's nested image canvas uses `--preview-canvas-background`. Their dark values preserve the same visual hierarchy.
- **Primary**: `--primary` (#3576F3), `--primary-hover` (#236efa), `--primary-foreground` (#ffffff), `--ring` (#2f6df3)
- **Borders**: `--border` (#e2e8f0), `--border-subtle` (#edf2f7), `--divider` (#e6e6e8), `--field-border` (rgba(0,0,0,0.21)), `--border-strong` (#c7c7cc), `--tab-active-border` (#DADADA), `--input` (#c7c7cc)
- **Content**: `--foreground` (#0f172a), `--muted-foreground` (#64748b), `--popover-foreground`, `--content-strong` (#000), `--content-muted` (#808080)
- **Active states**: `--interactive-active-background` (#f0f7ff), `--interactive-active-border` (#dbeafe)
- **Badges**: `--badge-active-background` (#E5FFD8), `--badge-active-text` (#808080), `--badge-active-dot` (#127557), `--badge-inactive-background` (#FFDBDB), `--badge-inactive-dot` (#B42318) — default/destructive variants render a trailing status dot
- **Status**: `--status-online-accent` (#D1EFC0), `--danger` (#FF7B7E), `--danger-surface` (#FFDBDB), `--danger-strong` (#FF0000), `--success` (#47941E), `--success-surface` (#E4F5E6), `--warning` (#A16207), `--warning-surface` (#FEF9C3)
- **Structured content**: `--section-border` (rgba(53,118,243,0.20)), `--section-background` (rgba(232,238,251,0.50)), `--table-header-background` (#E8EEFB)
- **Data visualisation**: `--chart-axis`, `--chart-grid`, `--chart-high-marker`, `--chart-low-marker`, `--chart-marker-border` keep chart contrast theme-aware without changing chart data.
- **Component presentation**: semantic tokens cover control borders/hover states, validation, toast/dialog styling, chart tooltips, plan promotion, social brands, and the theme-independent storefront widget preview.
- **Shadows**: `--shadow-blue`, `--shadow-auth`, `--shadow-panel`, `--auth-card-shadow`, `--toast-shadow`, `--dialog-shadow`, `--plan-selected-shadow`

The `.dark` block overrides the same variables with a layered deep-navy canvas, brighter blue interactive states, higher-contrast status colors, and blue-black panel shadows. Dark mode is toggled by adding `.dark` to `document.documentElement` (see `SidebarThemeToggle.tsx`) and the choice is persisted in `localStorage` under the `theme` key.

Use these tokens via Tailwind classes (e.g. `bg-background`, `text-primary`, `border-border-subtle`) rather than hardcoded hex values.

Literal hex values are intentionally retained only where color is application data rather than presentation styling: `ColorSelector.tsx` presets/defaults (valid values for `input[type="color"]` and backend submission) and self-contained static SVG/brand artwork.

## Navigation Items

Defined in `src/components/layout/sidebar/sideNav.ts`:

1. Overview (`/`) — OverviewIcon — `overview.view`
2. Contacts (`/contacts`) — ContactsIcon — `contacts.view`
3. Conversations (`/conversations`) — ConversationsIcon — `conversations.view`
4. Reports (`/reports`) — ReportsIcon — `reports.view`
5. Chat configure (`/chat-settings`) — ChatConfigurationIcon — `chatSettings.view`
6. AI training (`/ai-training`) — AiTrainingIcon — `aiTraining.view`
7. Settings (`/settings`) — SettingsIcon — `settings.profile.view`
8. Ask me (`/ask-me`) — AskMeIcon — `askMe.view`

Each item carries the `permission` that mirrors its route's `handle.permission`; `useNavItems()` returns only destinations the signed-in user's API payload actually grants a `view` capability for, so the sidebar and the 404 page can never link to a page the guard would reject.

## Architecture Notes

- `App.tsx` wraps `RouterProvider` in a `Suspense` fallback because routes are lazy-loaded. `main.tsx` nests `RootErrorBoundary > QueryClientProvider > Toaster > App`.
- `ErrorPage` reuses `AppCard` and `Button` for reload/home recovery. The router's root `errorElement` handles route errors, and `RootErrorBoundary` catches rendering failures. Unmatched paths fall through to the `*` route → `NotFoundPage`, which renders inside `AppLayout` and lists the `NAV_ITEMS` as shortcuts.
- The in-memory auth store (`src/features/auth/authStore.ts`) exposes `user`, `name`, `email`, `role`, and the normalized `permissions` list. Sign-in/sign-up populate it directly from their responses. On a browser refresh, `AppLayout` calls `authRefreshRequest` only when a JWT exists but the store is empty; a failed refresh clears the JWT and redirects to sign-in.
- **Access control is dynamic and backend-driven, with temporary role defaults.** `src/features/auth/permissions.ts` declares `PERMISSION_GROUPS` — the catalog of sections and the actions each supports — plus the parse/serialise helpers; it holds no role → capability policy. A user's backend `permissions` payload is an **array of section objects**, e.g. `[{ overview: { view: true } }, { "settings.roles": { view: true, edit: true } }]`. Section keys may contain dots, and a capability is the flattened `section.action` (for example `settings.roles.edit`). The full API and database contract — endpoints, payload examples, SQL and edge cases — lives in `permissions.md`.
- Components never compare role strings; they ask a capability question via `useCan("…")` (or `usePermissions()` when filtering a list), and routes declare the capability they need in `handle.permission` for `RouteGuard` to enforce. The sidebar, settings tabs, and 404 shortcuts consume the same normalized permission list in `authStore`, so only destinations whose **view** capability is granted are ever shown. `setUser` treats a backend `permissions` payload as authoritative (including an explicit empty payload); only when that field is absent does it resolve and store the role fallback from `permissionsDefaultData.ts`. There `ADMIN` gets the whole catalog, `EDITOR` gets every permission outside Settings and, inside it, only basic details (view + edit) — no team roles, plan, payments or store, and `MEMBER` gets conversations, `reports.view` + `reports.create` (generate report) and their own basic details (view/edit). An unknown role gets nothing — the policy fails closed. Either way a user lands on their first reachable page via `getHomeRoute(permissions)`.
- The role form (`features/settings/roleAndAccess/roleHistory/`) builds a role's grants as a `CustomTable` matrix (sections × actions, a checkbox in every cell) driven entirely by `PERMISSION_GROUPS` × `PERMISSION_ACTIONS`, so a new section needs no UI edit and any action can be granted to any role — there is no reserved/Admin-only capability. Its columns are View, Create / Edit and Delete: `create` and `edit` share one checkbox (create implies edit) and toggling it writes both actions, while the payload still carries them as separate keys. The form prefills the matrix from `permissionValuesFrom` + `getDefaultPermissions`: selecting a role ticks that role's defaults (re-picking the same role is a no-op, so saved grants survive), and opening an edit prefers the grants saved on the row but falls back to the role's defaults when the row carries none — which is what the API returns today. `Permissions` tightens the shared table's cell padding through `CustomTable`'s `className` (the same `[&_td]:…` pattern the role table uses) rather than changing `CustomTable`. One `Controller name="permissions"` owns the whole map, and `toPermissionPayload` serialises it back to the array shape for POST/PATCH `/admin/users`; `toPermissionValues` expands a response into the editable map (keeping unknown sections so a save never drops them). The backend must persist and return this shape, and enforce authorization — this repository is only the frontend integration.
- Auth token is stored as `vitalb.jwt` in localStorage via helpers in `authStorage.ts`.
- `AppLayout` guards protected routes with `getAuthToken()` from `authStorage`, restores an empty in-memory auth store through `GET /auth/profile`, and redirects unauthenticated or failed-refresh sessions to `/sign-in` (preserving the origin in `state.from`). Concurrent restore calls share one request.
- All API requests use `VITE_AUTH_API_BASE_URL` (root `.env`) through the shared `apiFetch` wrapper (`src/lib/api.ts`). It prefixes `/api` to endpoints, attaches the Bearer token by default (optionally `auth: false`), and surfaces errors via toast. Restart the Vite dev server after changing env vars.
- Path alias `@/*` maps to `./src/*` (defined in `tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`).
- **Pages** are thin wrappers that compose feature components and own tab/`Outlet` routing (Conversations, Settings, AI training). **Features** hold domain logic organized as `components/`, `api/`, `query`/`hooks` files, and `types`.
- **Components** are split into `ui/` (shadcn primitives), `layout/` (app shell), `shared/` (reusable app components), `design/` (design system components).
- Sidebar supports desktop (collapsible, `w-[187px]` ↔ `w-[72px]`) and mobile (full-screen overlay). Mobile sidebar state lives in `src/stores/mobileSidebarStore.ts` (Zustand).
- Tabbed sections (Settings, AI training, Conversations, Contacts) share the same pattern: a `mainTabs` array of `{ id, label, path }`, the active tab derived from `location.pathname`, and navigation via `useNavigate` — with an index route `<Navigate>` redirect.
- The conversations filter state is a Zustand store (`features/conversations/conversationFilterStore.ts`), separate from the mobile sidebar store. Note the duplicate empty `conversationsFilterStore.ts`.
- Server state uses TanStack Query with feature-local query hooks and exported query keys (e.g. `visibilityQueryKey`, `roleHistoryQueryKey`, `chatSettingsIntegrationsQueryKey`, `userProfilesQueryKey`, `segamentsQueryKey`). Features without a backend yet return fixtures behind a simulated `delay()` (`reportApi.ts`, `contactsApi.ts`).
- **Contacts feature** (`src/features/contacts/`): `/contacts` has two tabs, `UserProfileDetails` and `Segaments`, both `CustomTable` lists fed by the `mockContacts.ts` fixtures through `contactsApi.ts` (2s simulated fetch delay; the getters return `[...array]` snapshots so query invalidation actually picks up deletions). Search matches every displayed column by deriving keys from the `columns` array. Deletes go through the shared `DeleteContacts.tsx` modal, which mirrors `DeleteRole`: validate row ids, call the delete fn, fire `onDeleted` so only the deleted rows are deselected, toast, then invalidate the query key. Adds use `AddSegament.tsx` (add-only, mirrors `AddRoleForm`, no edit mode) with `segamentFormSchema` from `contactSchema.ts` and a `createSegament` mock that pushes onto the fixture array.
- **Conversations feature** (`src/features/conversations/`): all four tab routes (Active chats, Escalated, Assigned, Archived) render the shared `ConversationsChatPannel`, while `ConversationsPage` owns the tabs and the `ConversationsFilter` sidebar. The panel is one surface split by dividers into list | thread | customer details, driven by the fixtures in `components/shared/conversations/conversationData.ts`; filter selections live in the Zustand `conversationFilterStore`. Message rows come from the shared `ChatMessage`.
- Settings sub-pages compose shared design components: tables use `CustomTable` (RoleHistory, PaymentHistory), detail displays use `DetailContainer`/`DetailGroup`/`DetailItem` (BasicDetails, SavedPaymentDetails), and create/edit flows use the shared `Modal` with `FormGroup` + field components (AddRoleForm, AddNewPayment, AddStore, DeleteRole, DeleteStore).
- The `unsavedChangesBar` shared component provides a warning system for unsaved changes.
- `components/shared/chatBox/` holds the shared chat primitives: `ChatBox` (visibility preview), `ChatInput`, and `ChatMessage`, which renders the user/bot bubbles plus the bot action row (Debug / Make correction / thumbs / approve ✓). `ChatMessage` is used by both the visibility preview and the conversations panel, so tweaks to it show up in both places.
- **Ask AI feature** (`src/features/askAi/`): AI chat assistant at `/ask-me`, composed of `AskAI.tsx` (chat + history banner) and `AskAIChat.tsx` (messages, input, file attachment). Uses `PreviewSection`, `AppSection`, and `Banner`.
- **Overview feature** (`src/features/overview/`): dashboard grid of metric `OverviewCard`s plus Recharts-based widgets (`ChatToSaleChart`, `PerformanceMatrix`, `ActionTrend`, `AverageOrderValue`) and side widgets (`SystemStatus`, `Tips`, `SetupProgress`, `KnowMore`).
- Known placeholders / dead files: `features/overview/overviewApi.ts`, `features/conversations/conversationsFilterStore.ts`, and `src/assets/auth/Background.tsx` are empty.

## Deployment

Hosted on Netlify. `netlify.toml` pins the build (`command = "pnpm build"`, `publish = "dist"`) and includes an SPA fallback rewrite (`/*` → `/index.html`, `status = 200`). The rewrite is required because routing is client-side: without it, direct access to deep links (e.g. `/settings/plan`) returns 404, even though loading the base URL works.

## Key Conventions

- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.
- Shared utils in `src/lib/utils.ts`: `delay()`, `getInitials()`, `debounce()`, `capitalize()` (display-casing API values: `"SUPER_ADMIN"` → `"Super Admin"`), `dateFormater(date, format?)` ("numeric" → `d/m/yyyy`, "long" → `d MMM yyyy`).
- Never compare `role` strings in a component: gate UI with `useCan(permission)` and protect pages with `handle.permission`. Adding a page or action means adding a `PERMISSION_GROUPS` entry (which the permissions table renders automatically); granting it stays a backend payload, never a frontend edit.
- Prefer semantic design tokens (`bg-background`, `text-primary`) over hardcoded colors.
- Use PascalCase for components, camelCase with `use` prefix for hooks.
- Use kebab-case for folder names (note `features/ai-training/` follows this).
- Route definitions live in `src/config/routes.tsx`.
- All shadcn UI primitives go in `src/components/ui/`.
- Design system components go in `src/components/design/`.
- Feature-specific business logic goes in `src/features/`.
- Pages compose features and should not contain business logic directly.
- Use `apiFetch` from `src/lib/api.ts` for all API calls (handles auth, errors, toasts).
- Table row types must be assignable to `Record<string, unknown>` (the `CustomTable` generic constraint). Declare them as object `type` aliases rather than `interface`s — interfaces have no implicit index signature, so the generic silently falls back and row typing is lost.

## Design System Components

### AppSectoin (`src/components/design/AppSectoin.tsx`)
Flex container with section styling (border-section-border, bg-section-bg). Used as the main chat container in AskAI and as a panel in Permissions. (Name retains the existing typo.)

### Banner (`src/components/design/Banner.tsx`)
Status banner with four variants:
- `success`: green border/bg with CircleCheck icon
- `destructive`: red border/bg with OctagonX icon (role="alert")
- `info`: blue section border/bg with Info icon (default)
- `warning`: warning border/bg with TriangleAlert icon

Props: `variant`, `isIcon`, `title`, `titleClassName`, `children`, `className`, `role`.

### Heading (`src/components/design/Heading.tsx`)
CVA-based heading with sizes:
- `2xl`: 24px, semi-bold
- `xlg`: 20px, semi-bold
- `lg`: 16px, semi-bold (default)
- `md`: 14px, medium

Supports `as` prop (h1-h6, p, span). Memoized.

### PreviewSection (`src/components/design/PreviewSection.tsx`)
White card wrapper with shadow-blue and border-blue-100/70. Outer container for AskAI and Reports pages.

### OverviewCard (`src/components/shared/OverviewCard.tsx`)
Metric card: `AppCard` with an icon tile, a title, and a `Heading size="xlg"` value. Props: `title`, `numbers`, `icon`.

### CustomTable (`src/components/design/CustomTable.tsx`)
Generic table (`T extends Record<string, unknown>`) wrapping `AppSection` + the shadcn `Table`. Props: `title`, `columns` (`Column[]` = `key`, `header`, `width`, `mobileWidth`, `align`, `render(value, row)`), `data`, `headerActions`, `rowActions`, `bulkActions(rows, deselectRows)`, `emptyMessage` / `emptyDescription` / `emptyState` / `emptyStateAction`, and `pagination` (`pageSize`, plus `page`/`total`/`onPageChange` for server-side paging). Pass `selectable` together with `getRowId` to enable row checkboxes and the bulk-action bar. Renders a stacked card layout below `md` and a real table above it. On mobile each card line is a two-column grid whose two tracks are resolved per side: a column's `mobileWidth` (e.g. `"70%"`), else the table's `mobileColumnSplit` (e.g. `["50%", "50%"]` for an even split, `["65%", "35%"]` otherwise), else `65%` for the side holding the lead column — the first column declaring a desktop `width`. Every line shares the same tracks, so all lead cells line up.

### TableSkeleton (`src/components/shared/skeletons/TableSkeletons.tsx`)
Loading placeholder for tables built from `Skeleton`. Props: `columns`, `rows`, `showHeader`.

### SearchField (`src/components/shared/SearchField.tsx`)
Responsive search input — full `InputField` on desktop, popover-wrapped input on mobile. Prop: `onSearchChange(value)`.
