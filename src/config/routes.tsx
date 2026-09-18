import { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import AppLayout from "../components/layout/AppLayou";
import { getAuthToken } from "@/features/auth/authStorage";
import RouteGuard, { type RouteHandle } from "@/features/auth/RouteGuard";

const SignInPage = lazy(() => import("@/pages/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const OverviewPage = lazy(() => import("@/pages/OverviewPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
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
const ActiveChat = lazy(() =>
  import("@/features/conversations/activeChats").then(({ ActiveChat }) => ({ default: ActiveChat })),
);
const Escalated = lazy(() => import("@/features/conversations/escalated"));
const AssignedToMe = lazy(() => import("@/features/conversations/assignedToMe"));
const Archived = lazy(() => import("@/features/conversations/archived"));

const UserProfileDetails = lazy(() => import("@/features/contacts/UserProfileDetails"));
const Segaments = lazy(() => import("@/features/contacts/Segaments"));

function GuestOnlyRoute() {
  return getAuthToken() ? <Navigate to="/" replace /> : <Outlet />;
}

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <GuestOnlyRoute />,
        children: [
          { path: "/sign-in", element: <SignInPage /> },
          { path: "/sign-up", element: <SignUpPage /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          {
            /**
             * Every protected page renders through here. Each route states the
             * capability it needs in `handle.permission`; `RouteGuard` turns a role
             * that lacks it away, so an unauthorised URL is unreachable no matter how
             * it was opened. Adding a route without a `handle` leaves it open to all
             * signed-in roles (the 404 catch-all relies on that).
             */
            element: <RouteGuard />,
            children: [
              { path: "/", element: <OverviewPage />, handle: { permission: "overview.view" } satisfies RouteHandle },
              {
                path: "/contacts",
                element: <ContactsPage />,
                handle: { permission: "contacts.view" } satisfies RouteHandle,
                children: [
                  { index: true, element: <Navigate to="user-profile-details" replace /> },
                  { path: "user-profile-details", element: <UserProfileDetails /> },
                  { path: "segaments", element: <Segaments /> },
                ]
              },
              {
                path: "/conversations",
                element: <ConversationsPage />,
                handle: { permission: "conversations.view" } satisfies RouteHandle,
                children: [
                  { index: true, element: <Navigate to="active-chats" replace /> },
                  { path: "active-chats", element: <ActiveChat /> },
                  { path: "escalated", element: <Escalated /> },
                  { path: "assigned-to-me", element: <AssignedToMe /> },
                  { path: "archived", element: <Archived /> },
                ],
              },
              { path: "/reports", element: <ReportsPage />, handle: { permission: "reports.view" } satisfies RouteHandle },
              { path: "/chat-settings", element: <ChatSettingsPage />, handle: { permission: "chatSettings.view" } satisfies RouteHandle },
              { path: "/chat-settings/visibility", element: <VisibilityPage />, handle: { permission: "chatSettings.view" } satisfies RouteHandle },
              {
                path: "/ai-training",
                element: <AiTrainingPage />,
                handle: { permission: "aiTraining.view" } satisfies RouteHandle,
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
              { path: "/ask-me", element: <AskMePage />, handle: { permission: "askMe.view" } satisfies RouteHandle },
              {
                path: "/settings",
                element: <SettingsPage />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="role-n-access" replace />,
                  },
                  { path: "role-n-access", element: <RoleAndAccess />, handle: { permission: "settings.profile.view" } satisfies RouteHandle },
                  { path: "plan", element: <Plan />, handle: { permission: "settings.plan.view" } satisfies RouteHandle },
                  { path: "payments", element: <Payments />, handle: { permission: "settings.payments.view" } satisfies RouteHandle },
                  { path: "store", element: <Store />, handle: { permission: "settings.store.view" } satisfies RouteHandle },
                ],
              },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
