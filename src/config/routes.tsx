import { createBrowserRouter, Navigate } from "react-router";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import AppLayout from "../components/layout/AppLayou";
import OverviewPage from "@/pages/OverviewPage";
import ContactsPage from "@/pages/ContactPage";
import ConversationsPage from "@/pages/ConversationsPage";
import ReportsPage from "@/pages/ReportsPage";
import { AiTrainingPage } from "@/pages/aiTraining";
import KnowledgeBaseTab from "@/pages/aiTraining/tabs/KnowledgeBaseTab";
import CorrectionsTab from "@/pages/aiTraining/tabs/CorrectionsTab";
import PromptToolsTab from "@/pages/aiTraining/tabs/PromptToolsTab";
import ChatSettingsPage from "@/pages/chatSettings/ChatSettingsPage";
import Visibility from "@/pages/chatSettings/Visibility";
import AskMePage from "@/pages/AskMePage";
import SettingsPage from "@/pages/SettingsPage";

export const router = createBrowserRouter([
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
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
      { path: "/ask-me", element: <AskMePage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
