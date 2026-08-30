import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import { Sidebar } from "@/components/shared/sidebar";
import { OverviewPage } from "@/pages/overview";
import { ContactsPage } from "@/pages/contacts";
import { ConversationsPage } from "@/pages/conversations";
import { ReportsPage } from "@/pages/reports";
import { ChatSettingsPage } from "@/pages/chatSettings";
import { Visibility } from "@/pages/chatSettings/chat";
import { AiTrainingPage } from "@/pages/aiTraining";
import { HelpPage } from "@/pages/help";
import { AskPage } from "@/pages/ask";
import { KnowledgeBaseTab } from "@/pages/aiTraining/tabs/KnowledgeBaseTab";
import { CorrectionsTab } from "@/pages/aiTraining/tabs/CorrectionsTab";
import { PromptToolsTab } from "@/pages/aiTraining/tabs/PromptToolsTab";

function AppLayout() {
  return (
    <div className="flex h-screen gap-0 overflow-hidden bg-background px-3 pb-[11px] pt-3 md:gap-[19px] md:px-[18px] md:pt-[19px]">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <OverviewPage /> },
      { path: "/contacts", element: <ContactsPage /> },
      { path: "/conversations", element: <ConversationsPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/chat-settings", element: <ChatSettingsPage /> },
      { path: "/chat-settings/visibility", element: <Visibility /> },
      {
        path: "/ai-training",
        element: <AiTrainingPage />,
        children: [
          {
            index: true,
            element: <Navigate to="knowledge-base" replace />,
          },
          { path: "knowledge-base", element: <KnowledgeBaseTab /> },
          { path: "corrections", element: <CorrectionsTab /> },
          { path: "prompt-tools", element: <PromptToolsTab /> },
        ],
      },
      { path: "/help", element: <HelpPage /> },
      { path: "/ask", element: <AskPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
