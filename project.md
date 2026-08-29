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
│   │   ├── shared/
│   │   │   ├── chatBox/
│   │   │   │   ├── ChatBox.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CopyField.tsx
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
│   │   │   └── TrackingSettings.tsx
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

- `src/App.tsx` — Root component with BrowserRouter, Sidebar layout, and route definitions
- `src/main.tsx` — Entry point, renders App into DOM
- `src/index.css` — Vitalb design template: color tokens and a responsive type scale (`text-display`, `text-title`, `text-subtitle`, `text-body`, `text-body-sm`, `text-caption`, `text-micro`) that changes at mobile, tablet (`768px`), and desktop (`1024px`).

## Features

### features/chatSettings/

- `CrawlSettings.tsx` — Crawl settings panel with stock products selector, tag-based ignore elements input, and CSS selector syntax reference
- `CustomSection.tsx` — Reusable section wrapper with heading and white background
- `IntegrationRow.tsx` — Integration row card with icon, status badge, description, and action button
- `Span.tsx` — Spam filter settings with rate limit, period, and message fields
- `TrackingSettings.tsx` — UTM tracking toggle with description

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
- `collapsible.tsx` — Collapsible panel using @base-ui/react primitives
- `dialog.tsx` — Modal dialog using @base-ui/react primitives
- `input.tsx` — Text input using @base-ui/react primitives
- `label.tsx` — Form label component
- `select.tsx` — Select dropdown using @base-ui/react primitives

### lib/

- `utils.ts` — cn() class merging utility (clsx + tailwind-merge)

### components/shared/

- `chatBox/ChatBox.tsx` — Reusable chat container with message list and auto-scroll
- `chatBox/ChatMessage.tsx` — Individual message bubble (user: right-aligned purple, bot: left-aligned white)
- `chatBox/ChatInput.tsx` — Message input with textarea and purple send button
- `CopyField.tsx` — Copy-to-clipboard field with value display and copy button
- `sidebar/Sidebar.tsx` — Left navigation: mobile drawer, tablet icon-collapse, desktop expanded
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
- `pages/chatSettings/ChatSettingsPage.tsx` — Chatbot configuration (/chat-settings) with collapsible sections for Channels, Integration, and Configurations; stacks and tightens padding on small screens
- `pages/chatSettings/tabs/Channels.tsx` — Channels tab: link, embed code, and QR code display
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
