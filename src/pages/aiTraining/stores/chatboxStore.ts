import { create } from "zustand";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatboxState {
  messages: ChatMessageProps[];
  setMessages: (message: ChatMessageProps) => void;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

export const useChatboxStore = create<ChatboxState>((set) => ({
  messages: [],
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setMessages: (newMessage) => set((state) => ({ messages: [...state.messages, newMessage] })),
}));