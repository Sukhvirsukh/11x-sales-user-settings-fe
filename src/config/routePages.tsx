import { lazy } from "react";
import { Navigate, Outlet } from "react-router";
import { getAuthToken } from "@/features/auth/authStorage";

export const SignInPage = lazy(() => import("@/pages/SignInPage"));
export const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
export const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
export const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
export const VerifyEmailPage = lazy(() => import("@/pages/VerifyEmailPage"));
export const OAuthCallbackPage = lazy(() => import("@/pages/OAuthCallbackPage"));
export const OverviewPage = lazy(() => import("@/pages/OverviewPage"));
export const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
export const ContactsPage = lazy(() => import("@/pages/ContactPage"));
export const ConversationsPage = lazy(() => import("@/pages/ConversationsPage"));
export const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
export const ChatSettingsPage = lazy(() => import("@/pages/chatSettings/ChatSettingsPage"));
export const VisibilityPage = lazy(() => import("@/pages/chatSettings/VisibilityPage"));
export const AskMePage = lazy(() => import("@/pages/AskMePage"));
export const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
export const KnowledgeBaseTab = lazy(() => import("@/pages/aiTraining/tabs/KnowledgeBaseTab"));
export const CorrectionsTab = lazy(() => import("@/pages/aiTraining/tabs/CorrectionsTab"));
export const PromptToolsTab = lazy(() => import("@/pages/aiTraining/tabs/PromptToolsTab"));
export const AiTrainingPage = lazy(() =>
  import("@/pages/aiTraining").then(({ AiTrainingPage }) => ({ default: AiTrainingPage })),
);
export const RoleAndAccess = lazy(() =>
  import("@/features/settings/roleAndAccess").then(({ RoleAndAccess }) => ({ default: RoleAndAccess })),
);
export const Plan = lazy(() =>
  import("@/features/settings/plan").then(({ Plan }) => ({ default: Plan })),
);
export const Payments = lazy(() =>
  import("@/features/settings/payments").then(({ Payments }) => ({ default: Payments })),
);
export const Store = lazy(() =>
  import("@/features/settings/store").then(({ Store }) => ({ default: Store })),
);
export const ActiveChat = lazy(() =>
  import("@/features/conversations/activeChats").then(({ ActiveChat }) => ({ default: ActiveChat })),
);
export const Escalated = lazy(() => import("@/features/conversations/escalated"));
export const AssignedToMe = lazy(() => import("@/features/conversations/assignedToMe"));
export const Archived = lazy(() => import("@/features/conversations/archived"));

export const UserProfileDetails = lazy(() => import("@/features/contacts/UserProfileDetails"));
export const Segments = lazy(() => import("@/features/contacts/Segments"));

export function GuestOnlyRoute() {
  return getAuthToken() ? <Navigate to="/" replace /> : <Outlet />;
}
