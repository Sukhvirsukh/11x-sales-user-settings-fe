import { type ReactNode } from "react";
import { ChatBox } from "@/components/shared/chatBox";
import { useChatboxStore, type ChatMessageProps } from "@/pages/aiTraining/stores";
import { StoreDropdown } from "./StoreDropdown";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  chatTitle?: string;
  chatPlaceholder?: string;
  onChatMessage?: (message: string) => void;
  children: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  chatTitle = "Chat",
  chatPlaceholder = "Type a message...",
  onChatMessage,
  children,
}: PageHeaderProps) {
  const { isOpen, setIsOpen, messages, setMessages } = useChatboxStore();

  function handleSendMessage(content: string) {
    if (onChatMessage) {
      onChatMessage(content);
      return;
    }

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
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-semibold leading-[29px] tracking-normal text-[#18181b]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-[2px] text-[14px] leading-[17px] text-[#18181b]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-[12px] flex items-center gap-[9px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-[35px] w-[90px] items-center justify-center rounded-[9px] border border-[#111113] bg-white text-[14px] font-medium leading-none text-[#111113]"
          >
            Test chat
          </button>
          <StoreDropdown />
        </div>
      </header>

      {/* Content area with ChatBox */}
      <div className="mt-[33px] flex w-full min-w-0 items-stretch gap-4 min-h-[calc(100vh-116px)]">
        <div className="min-w-0 flex-1">
          {children}
        </div>

        {isOpen && (
          <div className="w-[400px] shrink-0 self-stretch overflow-hidden rounded-[8px] border border-[#E6E6E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              title={chatTitle}
              onClose={() => setIsOpen(false)}
              placeholder={chatPlaceholder}
            />
          </div>
        )}
      </div>
    </div>
  );
}
