import { create } from "zustand";

export interface CorrectionRow {
  id: string;
  question: string;
  correction: string;
  createdDate: string;
  expire: string;
  status: string;
}

interface CorrectionsState {
  rows: CorrectionRow[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addRow: (row: CorrectionRow) => void;
  removeRow: (id: string) => void;
}

const initialRows: CorrectionRow[] = [
  {
    id: "1",
    question: "Do you have in black shoe?",
    correction: "Yes Exactly we have the right fit for you....",
    createdDate: "10/02/26",
    expire: "10/02/26",
    status: "Deactive",
  },
  {
    id: "2",
    question: "Do you have in black shoe?",
    correction: "Yes Exactly we have the right fit for you....",
    createdDate: "10/02/26",
    expire: "10/02/26",
    status: "Active",
  },
];

export const useCorrectionsStore = create<CorrectionsState>((set) => ({
  rows: initialRows,
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  addRow: (row) => set((state) => ({ rows: [...state.rows, row] })),
  removeRow: (id) => set((state) => ({ rows: state.rows.filter((r) => r.id !== id) })),
}));
