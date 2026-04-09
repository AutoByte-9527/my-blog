import { create } from "zustand";
import { Category, Tag } from "@my-blog/shared";

interface AppState {
  categories: Category[];
  tags: Tag[];
  searchQuery: string;
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  categories: [],
  tags: [],
  searchQuery: "",
  setCategories: (categories) => set({ categories }),
  setTags: (tags) => set({ tags }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
