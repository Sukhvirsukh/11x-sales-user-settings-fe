# Project Map

> Read this file before exploring the codebase. Update it whenever files are added, moved, or removed.

---

## App Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VITALB DASHBOARD                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────────────────────┐   │
│  │              │    │                                                  │   │
│  │   SIDEBAR    │    │              MAIN CONTENT AREA                   │   │
│  │              │    │                                                  │   │
│  │  ┌────────┐  │    │  ┌────────────────────────────────────────────┐  │   │
│  │  │Vitalb  │  │    │  │  Page Header (title, subtitle, actions)   │  │   │
│  │  └────────┘  │    │  └────────────────────────────────────────────┘  │   │
│  │              │    │                                                  │   │
│  │  ──────────  │    │  ┌────────────────────────────────────────────┐  │   │
│  │              │    │  │  Tabs / Sub-tabs                          │  │   │
│  │  Overview  ──┼────┤  └────────────────────────────────────────────┘  │   │
│  │  Contacts  ──┤    │                                                  │   │
│  │  Conversa… ──┤    │  ┌────────────────────────────────────────────┐  │   │
│  │  Reports   ──┤    │  │  Content Card / Table                     │  │   │
│  │  Chat Set… ──┤    │  │                                            │  │   │
│  │  AI Train… ──┤    │  │  • Knowledge Bank Table                   │  │   │
│  │              │    │  │  • Search + Filters                       │  │   │
│  │  ──────────  │    │  │  • Status Badges                          │  │   │
│  │              │    │  │                                            │  │   │
│  │  Help & S… ──┤    │  └────────────────────────────────────────────┘  │   │
│  │  Ask me A… ──┤    │                                                  │   │
│  │              │    └──────────────────────────────────────────────────┘   │
│  │  ──────────  │                                                           │
│  │  [Avatar]    │                                                           │
│  │  Racheal K   │                                                           │
│  └──────────────┘                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

ROUTES:
  /                    → OverviewPage
  /contacts            → ContactsPage
  /conversations       → ConversationsPage
  /reports             → ReportsPage
  /chat-settings       → ChatSettingsPage
  /chat-settings/visibility → Visibility
  /ai-training         → AiTrainingPage (MAIN PAGE)
  /help                → HelpPage
  /ask                 → AskPage
```

## Directory Tree

```
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── custom/
│   │   │   ├── CustomColorSelector.tsx
│   │   │   ├── CustomFormGroup.tsx
│   │   │   ├── CustomImageUploader.tsx
│   │   │   ├── CustomInput.tsx
│   │   │   ├── CustomLabel.tsx
│   │   │   ├── CustomMultiTextField.tsx
│   │   │   ├── CustomSelect.tsx
│   │   │   ├── CustomSlider.tsx
│   │   │   └── index.ts
│   │   ├── shared/
│   │   │   ├── chatBox/
│   │   │   │   ├── ChatBox.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CopyField.tsx
│   │   │   ├── unSavedChanges/
│   │   │   │   ├── UnSavedChangesBar.tsx
│   │   │   │   ├── useUnSavedChanges.ts
│   │   │   │   └── index.ts
│   │   │   ├── pageHeader/
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── index.ts
│   │   │   ├── sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SidebarMenuButton.tsx
│   │   │   │   ├── SidebarUserCard.tsx
│   │   │   │   ├── sidebarStore.ts
│   │   │   │   └── index.ts
│   │   │   └── userProfile/
│   │   │       ├── UserProfile.tsx
│   │   │       └── index.ts
│   │   └── ui/
│   │       ├── badge/
│   │       │   ├── Badge.tsx
│   │       │   └── index.ts
│   │       ├── button/
│   │       │   ├── Button.tsx
│   │       │   └── index.ts
│   │       ├── checkbox/
│   │       │   ├── Checkbox.tsx
│   │       │   └── index.ts
│   │       ├── collapsible.tsx
│   │       ├── field.tsx
│   │       ├── searchInput/
│   │       │   ├── SearchInput.tsx
│   │       │   └── index.ts
│   │       └── tabs/
│   │       ├── Tabs.tsx
│   │       └── index.ts
│   ├── features/
│   │   ├── chatSettings/
│   │   │   ├── CrawlSettings.tsx
│   │   │   ├── CustomSection.tsx
│   │   │   ├── IntegrationRow.tsx
│   │   │   ├── Span.tsx
│   │   │   ├── TrackingSettings.tsx
│   │   │   └── visibility/
│   │   │       ├── AllAccordions.tsx
│   │   │       └── fields/
│   │   │           ├── ChatBubbleTypeSelector.tsx
│   │   │           ├── LookNFeel.tsx
│   │   │           ├── Position.tsx
│   │   │           ├── SocialButton.tsx
│   │   │           └── LeadCollection.tsx
│   │   └── knowledgeBase/
│   │       ├── components/
│   │       │   ├── KnowledgeTable.tsx
│   │       │   └── KnowledgeModal.tsx
│   │       ├── types.ts
│   │       └── index.ts
│   ├── pages/
│   │   ├── aiTraining/
│   │   │   ├── AiTrainingPage.tsx
│   │   │   └── index.ts
│   │   │   tabs/
│   │   │   ├── KnowledgeBaseTab.tsx
│   │   │   ├── CorrectionsTab.tsx
│   │   │   └── PromptToolsTab.tsx
│   │   │   stores/
│   │   │   ├── knowledgeBaseStore.ts
│   │   │   ├── correctionsStore.ts
│   │   │   ├── promptToolsStore.ts
│   │   │   └── index.ts
│   │   ├── ask/
│   │   │   ├── AskPage.tsx
│   │   │   └── index.ts
│   │   ├── chatSettings/
│   │   │   ├── ChatSettingsPage.tsx
│   │   │   ├── index.ts
│   │   │   ├── chat/
│   │   │   │   ├── Visibility.tsx
│   │   │   │   └── index.ts
│   │   │   ├── store/
│   │   │   │   └── chatVisibilityStore.tsx
│   │   │   tabs/
│   │   │   ├── Channels.tsx
│   │   │   ├── Configurations.tsx
│   │   │   └── Integrations.tsx
│   │   ├── contacts/
│   │   │   ├── ContactsPage.tsx
│   │   │   └── index.ts
│   │   ├── conversations/
│   │   │   ├── ConversationsPage.tsx
│   │   │   └── index.ts
│   │   ├── help/
│   │   │   ├── HelpPage.tsx
│   │   │   └── index.ts
│   │   ├── overview/
│   │   │   ├── OverviewPage.tsx
│   │   │   └── index.ts
│   │   └── reports/
│   │       ├── ReportsPage.tsx
│   │       └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── project.md
└── vite.config.ts
```

---

## App Shell

- `src/App.tsx` — Root component with createBrowserRouter (data router), Sidebar layout, and route definitions
- `src/main.tsx` — Entry point, renders App into DOM
- `src/index.css` — Vitalb design template: color tokens and a responsive type scale (`text-display`, `text-title`, `text-subtitle`, `text-body`, `text-body-sm`, `text-caption`, `text-micro`) that changes at mobile, tablet (`768px`), and desktop (`1024px`).

## Features

### features/chatSettings/

- `CrawlSettings.tsx` — Crawl settings panel with stock products selector, tag-based ignore elements input (uses CustomMultiTextField), and CSS selector syntax reference
- `CustomSection.tsx` — Reusable section wrapper with heading and white background
- `IntegrationRow.tsx` — Integration row card with icon, status badge, description, and action button
- `Span.tsx` — Spam filter settings with rate limit, period, and message fields
- `TrackingSettings.tsx` — UTM tracking toggle with description
- `visibility/AllAccordions.tsx` — Tab config (id, label, content) for the Chat visibility accordion
- `visibility/fields/ChatBubbleTypeSelector.tsx` — Radio group with visual previews for chat bubble styles (type bar, compact, classic, custom)
- `visibility/fields/LookNFeel.tsx` — Chat look & feel fields (agent name, chat face image, welcome message, pre-defined messages, placeholder, chat bubble type, primary color, notification color)
- `visibility/fields/Position.tsx` — Widget position fields (page visibility, bubble size, position, z-index)
- `visibility/fields/SocialButton.tsx` — Social button fields (WhatsApp and Instagram connect options with checkboxes)
- `visibility/fields/LeadCollection.tsx` — Lead collection fields (email collection status, title, subtitle, button label, email placeholder, marketing consent options)

### features/knowledgeBase/

- `components/KnowledgeTable.tsx` — Table displaying knowledge items with checkboxes, status badges, and formatted dates
- `components/KnowledgeModal.tsx` — Add Knowledge modal: 6 bordered option cards, none selected by default; selected card uses a blue left bar + name/URL (or Content) fields, helper copy for Custom text
- `types.ts` — KnowledgeItem interface (id, name, url, status, dates, format)
- `index.ts` — Public exports: KnowledgeTable, KnowledgeModal, KnowledgeItem

## Shared

### components/ui/ (shadcn/ui)

- `button.tsx` — Reusable button with variants: default, outline, secondary, ghost, destructive, link
- `badge.tsx` — Status badge with variants: default, secondary, destructive, outline, ghost, link
- `tabs.tsx` — Underline-style tab navigation component
- `checkbox.tsx` — Checkbox input using @base-ui/react primitives
- `accordion.tsx` — Accordion using @base-ui/react; `inset` (default) matches Chat Settings sections, `card` matches Chat visibility tabs
- `collapsible.tsx` — Collapsible panel using @base-ui/react primitives
- `dialog.tsx` — Modal dialog using @base-ui/react primitives
- `field.tsx` — Field components (Field, FieldLabel, FieldDescription, FieldError, FieldGroup) for form layouts
- `input.tsx` — Text input using @base-ui/react primitives
- `label.tsx` — Form label component
- `radio-group.tsx` — Radio group and radio group item using @base-ui/react primitives
- `select.tsx` — Select dropdown using @base-ui/react primitives
- `separator.tsx` — Visual separator/divider component
- `slider.tsx` — Slider input using @base-ui/react primitives

### components/custom/ (app wrappers on shadcn)

- `CustomColorSelector.tsx` — Color picker with hex input, native color selector, and preset palette; supports controlled/uncontrolled modes
- `CustomFormGroup.tsx` — Vertical stack for form fields; gap `sm` | `md` (default) | `lg`
- `CustomImageUploader.tsx` — Image upload with drag-and-drop, file type/size validation, preview; supports controlled/uncontrolled modes
- `CustomInput.tsx` — Label + shadcn Input: small semibold label, white rounded-xl field; optional red error text and hint
- `CustomLabel.tsx` — Styled shadcn Label (semibold, body-sm); used by CustomInput and standalone fields
- `CustomMultiTextField.tsx` — Multi-tag input field; add tags with Enter, remove with X; supports controlled/uncontrolled modes, paste support, hint text
- `CustomSelect.tsx` — Label + shadcn Select; same field chrome as CustomInput
- `CustomSlider.tsx` — Label + shadcn Slider with live value (optional unit) and hint

### lib/

- `utils.ts` — cn() class merging utility (clsx + tailwind-merge)

### components/shared/

- `chatBox/ChatBox.tsx` — Reusable chat container with message list and auto-scroll
- `chatBox/ChatMessage.tsx` — Individual message bubble (user: right-aligned purple, bot: left-aligned white)
- `chatBox/ChatInput.tsx` — Message input with textarea and purple send button
- `CopyField.tsx` — Copy-to-clipboard field with value display and copy button
- `unSavedChanges/UnSavedChangesBar.tsx` — Dirty footer (Save/Discard) plus leave dialog via `useBlocker`; only this component is needed on a page
- `unSavedChanges/useUnSavedChanges.ts` — Hook to manage form dirty state, save, and discard functionality
- `sidebar/Sidebar.tsx` — Left navigation: mobile drawer, tablet icon-collapse, desktop expanded; hidden on `/chat-settings/visibility`
- `sidebar/isSidebarHidden.ts` — Routes where the dashboard sidebar is not shown
- `sidebar/SidebarMenuButton.tsx` — Mobile hamburger that opens the sidebar drawer
- `sidebar/SidebarUserCard.tsx` — Bottom user card; compact on collapsed tablet sidebar
- `sidebar/sidebarStore.ts` — Mobile open and tablet collapsed state
- `userProfile/UserProfile.tsx` — User profile display with avatar image or initials fallback
- `pageHeader/PageHeader.tsx` — Page title, subtitle, and action buttons layout

## Pages

- `pages/overview/OverviewPage.tsx` — Dashboard overview (/)
- `pages/contacts/ContactsPage.tsx` — Contacts management (/contacts)
- `pages/conversations/ConversationsPage.tsx` — Chat conversations (/conversations)
- `pages/reports/ReportsPage.tsx` — Analytics and reports (/reports)
- `pages/chatSettings/ChatSettingsPage.tsx` — Chatbot configuration (/chat-settings) with shadcn Accordion sections
- `pages/chatSettings/chat/Visibility.tsx` — Chat visibility page: layout (accordion + Preview shell); accordion items come from AllAccordions; dirty save/discard via `useVisibilityStore`
- `pages/chatSettings/chat/Preview.tsx` — Faded site background + floating chat trigger; opens PreviewChatPanel
- `pages/chatSettings/chat/PreviewChatPanel.tsx` — Preview chat widget driven by visibility store settings
- `pages/chatSettings/chat/ChatBubbleButtons.tsx` — Type / Compact / Classic / Custom chat open buttons for the preview
- `pages/chatSettings/store/chatVisibilityStore.tsx` — Zustand store for all visibility fields, `isDirty`, `save`, `discard` (last saved), `resetToDefault`
- `pages/chatSettings/tabs/Channels.tsx` — Channels tab: link, embed code, QR, and Visibility link to `/chat-settings/visibility`
- `pages/chatSettings/tabs/Configurations.tsx` — Configurations tab: combines CrawlSettings, TrackingSettings, and Span components
- `pages/chatSettings/tabs/Integrations.tsx` — Integrations tab: list of integration rows with status
- `pages/aiTraining/AiTrainingPage.tsx` — AI Training: knowledge base table (/ai-training)
- `pages/aiTraining/tabs/KnowledgeBaseTab.tsx` — Knowledge base table with search, sub-tabs, and Knowledge button
- `pages/aiTraining/tabs/CorrectionsTab.tsx` — Corrections/questions bank tab
- `pages/aiTraining/tabs/PromptToolsTab.tsx` — Prompt tools/behavior settings tab
- `pages/help/HelpPage.tsx` — Help & support (/help)
- `pages/ask/AskPage.tsx` — AI assistant (/ask)

## Config

- `vite.config.ts` — Vite config with React, Tailwind, and @ path alias
- `tsconfig.app.json` — TypeScript config with path aliases
- `package.json` — Dependencies: react, react-dom, react-router, tailwindcss, lucide-react

## Open TODOs

- (none yet)
