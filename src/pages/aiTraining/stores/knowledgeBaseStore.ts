import { create } from "zustand";

export interface KnowledgeItem {
  id: string;
  url: string;
  status: string;
  createdDate: string;
  lastRefresh: string;
  format: string;
}

interface KnowledgeBaseState {
  items: KnowledgeItem[];
  selectedIds: string[];
  activeSubTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveSubTab: (tab: string) => void;
  selectAll: (checked: boolean, filteredIds: string[]) => void;
  selectItem: (id: string, checked: boolean) => void;
  addItem: (item: KnowledgeItem) => void;
  removeItem: (id: string) => void;
}

const initialItems: KnowledgeItem[] = [
  // Web pages
  { id: "1", url: "https://learnwipro.com/about", status: "Active", createdDate: "10/02/26", lastRefresh: "10/02/26", format: "Web pages" },
  { id: "2", url: "https://learnwipro.com/products", status: "Active", createdDate: "09/15/26", lastRefresh: "09/20/26", format: "Web pages" },
  { id: "3", url: "https://learnwipro.com/faq", status: "Active", createdDate: "08/10/26", lastRefresh: "08/15/26", format: "Web pages" },
  // PDFs
  { id: "4", url: "Product-Catalog-2026.pdf", status: "Active", createdDate: "07/01/26", lastRefresh: "07/05/26", format: "PDFs" },
  { id: "5", url: "Return-Policy.pdf", status: "Inactive", createdDate: "06/20/26", lastRefresh: "06/25/26", format: "PDFs" },
  // Sitemaps
  { id: "6", url: "https://learnwipro.com/sitemap.xml", status: "Active", createdDate: "05/10/26", lastRefresh: "05/15/26", format: "Sitemaps" },
  { id: "7", url: "https://learnwipro.com/blog/sitemap.xml", status: "Active", createdDate: "04/05/26", lastRefresh: "04/10/26", format: "Sitemaps" },
  // Feed items
  { id: "8", url: "https://learnwipro.com/rss", status: "Active", createdDate: "03/01/26", lastRefresh: "03/05/26", format: "Feed items" },
  { id: "9", url: "https://learnwipro.com/atom", status: "Inactive", createdDate: "02/15/26", lastRefresh: "02/20/26", format: "Feed items" },
  // Text - empty to show empty state
];

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set) => ({
  items: initialItems,
  selectedIds: [],
  activeSubTab: "All",
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveSubTab: (tab) => set({ activeSubTab: tab, selectedIds: [] }),
  selectAll: (checked, filteredIds) => {
    set({ selectedIds: checked ? [...filteredIds] : [] });
  },
  selectItem: (id, checked) =>
    set((state) => ({
      selectedIds: checked
        ? [...state.selectedIds, id]
        : state.selectedIds.filter((i) => i !== id),
    })),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      selectedIds: state.selectedIds.filter((i) => i !== id),
    })),

}));
