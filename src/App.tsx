import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Sidebar } from "@/components/shared/sidebar";
import { OverviewPage } from "@/pages/overview";
import { ContactsPage } from "@/pages/contacts";
import { ConversationsPage } from "@/pages/conversations";
import { ReportsPage } from "@/pages/reports";
import { ChatSettingsPage } from "@/pages/chatSettings";
import { AiTrainingPage } from "@/pages/aiTraining";
import { HelpPage } from "@/pages/help";
import { AskPage } from "@/pages/ask";
import { KnowledgeBaseTab } from "@/pages/aiTraining/tabs/KnowledgeBaseTab";
import { CorrectionsTab } from "@/pages/aiTraining/tabs/CorrectionsTab";
import { PromptToolsTab } from "@/pages/aiTraining/tabs/PromptToolsTab";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen gap-[19px] overflow-hidden bg-[#f7f7f8] pb-[11px] pl-[18px] pr-[18px] pt-[19px]">
        <Sidebar />
        <main className="min-w-0 flex-1 flex flex-col overflow-y-auto">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/chat-settings" element={<ChatSettingsPage />} />
            <Route path="/ai-training" element={<AiTrainingPage />}>
              <Route index element={<Navigate to="/ai-training/corrections" replace />} />
              <Route path="knowledge-base" element={<KnowledgeBaseTab />} />
              <Route path="corrections" element={<CorrectionsTab />} />
              <Route path="prompt-tools" element={<PromptToolsTab />} />
            </Route>
            <Route path="/help" element={<HelpPage />} />
            <Route path="/ask" element={<AskPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
