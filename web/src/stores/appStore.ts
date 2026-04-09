import { create } from "zustand";
import { Category, Tag } from "@my-blog/shared";

interface AppState {
  categories: Category[];
  tags: Tag[];
  searchQuery: string;
  totalVisits: number;
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  setSearchQuery: (query: string) => void;
  setTotalVisits: (total: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  categories: [],
  tags: [],
  searchQuery: "",
  totalVisits: 0,
  setCategories: (categories) => set({ categories }),
  setTags: (tags) => set({ tags }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setTotalVisits: (totalVisits) => set({ totalVisits }),
}));
