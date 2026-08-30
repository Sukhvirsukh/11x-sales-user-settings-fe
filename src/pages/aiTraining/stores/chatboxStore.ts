import { create } from "zustand";

export interface ChatboxState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useChatboxStore = create<ChatboxState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
