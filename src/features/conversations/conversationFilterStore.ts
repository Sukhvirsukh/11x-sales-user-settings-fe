import { create } from "zustand"

type SelectedFilters = Record<string, string[]>

type ConversationFilterState = {
    searchQuery: string
    selectedFilters: SelectedFilters
    setSearchQuery: (searchQuery: string) => void
    toggleFilter: (group: string, option: string, selected: boolean) => void
    clearFilters: () => void
}

const defaultFilters: SelectedFilters = {
    Channels: ["Website"],
}

export const useConversationFilterStore = create<ConversationFilterState>((set) => ({
    searchQuery: "",
    selectedFilters: defaultFilters,
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    toggleFilter: (group, option, selected) => set((state) => {
        const current = state.selectedFilters[group] ?? []
        const next = selected
            ? [...current, option]
            : current.filter((value) => value !== option)

        return {
            selectedFilters: {
                ...state.selectedFilters,
                [group]: next,
            },
        }
    }),
    clearFilters: () => set({ searchQuery: "", selectedFilters: defaultFilters }),
}))
