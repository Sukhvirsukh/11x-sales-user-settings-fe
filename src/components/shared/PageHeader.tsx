import { type ReactNode } from "react";
import { ChatBox } from "@/components/shared/chatBox";
import { SidebarMenuButton } from "@/components/shared/sidebar";
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
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <SidebarMenuButton />
          <div className="min-w-0">
            <h1 className="text-display font-semibold tracking-normal text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-[2px] text-subtitle text-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-[9px] md:mt-[12px] md:w-auto md:shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-[35px] min-w-[90px] flex-1 items-center justify-center rounded-[9px] border border-foreground bg-card text-body font-medium leading-none text-foreground md:flex-none"
          >
            Test chat
          </button>
          <StoreDropdown />
        </div>
      </header>

      {/* Content area with ChatBox */}
      <div className="mt-4 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 md:mt-[33px] lg:min-h-0 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1">
          {children}
        </div>

        {isOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              aria-label="Close test chat"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed inset-x-3 bottom-3 top-3 z-50 overflow-hidden rounded-[8px] border border-border bg-card shadow-md lg:static lg:inset-auto lg:z-auto lg:w-[min(360px,38%)] lg:max-w-[400px] lg:shrink-0 lg:self-stretch">
              <ChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                title={chatTitle}
                onClose={() => setIsOpen(false)}
                placeholder={chatPlaceholder}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
