import { createBrowserRouter, Navigate } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
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
import VisibilityPage from "@/pages/chatSettings/VisibilityPage";
import AskMePage from "@/pages/AskMePage";
import SettingsPage from "@/pages/SettingsPage";
import { RoleAndAccess } from "@/features/settings/roleAndAccess";
import { Plan } from "@/features/settings/plan";
import { Payments } from "@/features/settings/payments";
import { Store } from "@/features/settings/store";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <OverviewPage /> },
          { path: "/contacts", element: <ContactsPage /> },
          { path: "/conversations", element: <ConversationsPage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/chat-settings", element: <ChatSettingsPage /> },
          { path: "/chat-settings/visibility", element: <VisibilityPage /> },
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
          {
            path: "/settings",
            element: <SettingsPage />,
            children: [
              {
                index: true,
                element: <Navigate to="role-n-access" replace />,
              },
              { path: "role-n-access", element: <RoleAndAccess /> },
              { path: "plan", element: <Plan /> },
              { path: "payments", element: <Payments /> },
              { path: "store", element: <Store /> },
            ],
          },
        ],
      },
    ],
  },
]);
