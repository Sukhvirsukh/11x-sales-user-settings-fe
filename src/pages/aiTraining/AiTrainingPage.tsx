import { ChevronDown } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router";
import { ChatBox } from "@/components/shared/chatBox";
import { useChatboxStore, type ChatMessageProps } from "./stores";

const mainTabs = [
  { id: "knowledge-base", label: "Knowledge base", path: "/ai-training/knowledge-base" },
  { id: "corrections", label: "Corrections", path: "/ai-training/corrections" },
  { id: "prompt-tools", label: "Prompt tools", path: "/ai-training/prompt-tools" },
];

export function AiTrainingPage() {
  const location = useLocation();
  const { isOpen, setIsOpen, messages, setMessages } = useChatboxStore();

  const isActive = (path: string) => location.pathname === path;

  function handleSendMessage(content: string) {
    const userMessage: ChatMessageProps = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(userMessage);

    setTimeout(() => {
      const botMessage: ChatMessageProps = {
        id: crypto.randomUUID(),
        content: "I'm analyzing your knowledge base. How can I help you with this data?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(botMessage);
    }, 1000);
  }

  return (
    <section className="h-full min-w-0 pt-[11px] text-[#18181b]">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-semibold leading-[29px] tracking-normal">
            Ai training
          </h1>
          <p className="mt-[2px] text-[14px] leading-[17px] text-[#18181b]">
            Train your AI to better understand your business
          </p>
        </div>

        <div className="mt-[12px] flex items-center gap-[9px]">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-[35px] w-[90px] items-center justify-center rounded-[9px] border border-[#111113] bg-white text-[14px] font-medium leading-none text-[#111113]">
            Test chat
          </button>
          <button className="flex h-[35px] w-[97px] items-center justify-center gap-[9px] rounded-[9px] border border-[#a4a4ab] bg-white text-[14px] font-medium leading-none text-[#6d6d76]">
            Store1
            <ChevronDown className="h-[15px] w-[15px]" strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="mt-[33px] flex w-full min-w-0 items-stretch gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[12px] pl-[4px]">
            {mainTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex h-[23px] items-center justify-center rounded-[5px] px-[7px] text-[11px] font-medium leading-none transition-colors ${
                  isActive(tab.path)
                    ? "border border-[#d7d7dc] bg-white text-[#111113] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                    : "text-[#111113] hover:text-[#111113]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <Outlet />
        </div>

        {isOpen && (
          <div className="w-[400px] shrink-0 self-stretch overflow-hidden rounded-[8px] border border-[#E6E6E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              title="Knowledge Base Chat"
              onClose={() => setIsOpen(false)}
              placeholder="Ask about your knowledge base..."
            />
          </div>
        )}
      </div>
    </section>
  );
}
