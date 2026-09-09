import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import AppLayout from "../components/layout/AppLayou";

const SignInPage = lazy(() => import("@/pages/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const OverviewPage = lazy(() => import("@/pages/OverviewPage"));
const ContactsPage = lazy(() => import("@/pages/ContactPage"));
const ConversationsPage = lazy(() => import("@/pages/ConversationsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const ChatSettingsPage = lazy(() => import("@/pages/chatSettings/ChatSettingsPage"));
const VisibilityPage = lazy(() => import("@/pages/chatSettings/VisibilityPage"));
const AskMePage = lazy(() => import("@/pages/AskMePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const KnowledgeBaseTab = lazy(() => import("@/pages/aiTraining/tabs/KnowledgeBaseTab"));
const CorrectionsTab = lazy(() => import("@/pages/aiTraining/tabs/CorrectionsTab"));
const PromptToolsTab = lazy(() => import("@/pages/aiTraining/tabs/PromptToolsTab"));
const AiTrainingPage = lazy(() =>
  import("@/pages/aiTraining").then(({ AiTrainingPage }) => ({ default: AiTrainingPage })),
);
const RoleAndAccess = lazy(() =>
  import("@/features/settings/roleAndAccess").then(({ RoleAndAccess }) => ({ default: RoleAndAccess })),
);
const Plan = lazy(() =>
  import("@/features/settings/plan").then(({ Plan }) => ({ default: Plan })),
);
const Payments = lazy(() =>
  import("@/features/settings/payments").then(({ Payments }) => ({ default: Payments })),
);
const Store = lazy(() =>
  import("@/features/settings/store").then(({ Store }) => ({ default: Store })),
);

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
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
