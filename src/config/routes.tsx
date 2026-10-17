import { createBrowserRouter, Navigate } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import AppLayout from "../components/layout/AppLayou";
import RouteGuard, { type RouteHandle } from "@/features/auth/RouteGuard";
import {
  SignInPage,
  SignUpPage,
  ForgotPassword,
  ResetPasswordPage,
  VerifyEmailPage,
  OAuthCallbackPage,
  OverviewPage,
  NotFoundPage,
  ContactsPage,
  ConversationsPage,
  ReportsPage,
  ChatSettingsPage,
  VisibilityPage,
  AskMePage,
  SettingsPage,
  KnowledgeBaseTab,
  CorrectionsTab,
  PromptToolsTab,
  AiTrainingPage,
  RoleAndAccess,
  Plan,
  Payments,
  Store,
  ActiveChat,
  Escalated,
  AssignedToMe,
  Archived,
  UserProfileDetails,
  Segments,
  GuestOnlyRoute,
} from "./routePages";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      // Opened from the confirmation email, signed in or not.
      { path: "/verify-email", element: <VerifyEmailPage /> },
      // Google / Facebook / Shopify sign-in returns here.
      { path: "/auth/callback", element: <OAuthCallbackPage /> },
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
                  { path: "segments", element: <Segments /> },
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
