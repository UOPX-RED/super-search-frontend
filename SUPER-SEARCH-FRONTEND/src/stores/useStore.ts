import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  keywords: string[];
  selectedCourses: string[];
  apiResult: any;
  setKeywords: (keywords: string[]) => void;
  setSelectedCourses: (courses: string[]) => void;
  setApiResult: (result: any) => void;
}

const useSearchStore = create(
  persist<StoreState>(
    (set) => ({
      keywords: [],
      selectedCourses: [],
      apiResult: null,
      setKeywords: (keywords) => set({ keywords }),
      setSelectedCourses: (courses) => set({ selectedCourses: courses }),
      setApiResult: (result) => set({ apiResult: result }),
    }),
    {
      name: "audit-storage",
    }
  )
);

export default useSearchStore;
