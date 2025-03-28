import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HighlightedSection {
  start_index: number;
  end_index: number;
  matched_text: string;
  reason: string;
  confidence: number;
}

export interface ApiResult {
  id: string;
  request_id: string;
  source_id: string;
  content_type: string;
  original_text: string;
  keywords_searched: string[];
  highlighted_sections: HighlightedSection[];
  has_flags: boolean;
  metadata: {
    programId: string;
    [key: string]: any;
  };
  created_at: string;
  keywords_matched: string[];
}

interface StoreState {
  keywords: string[];
  selectedCourses: string[];
  apiResults: ApiResult[];

  setKeywords: (keywords: string[]) => void;
  setSelectedCourses: (courses: string[]) => void;
  setApiResults: (results: ApiResult[]) => void;
  addApiResult: (newResult: ApiResult) => void;
}

const useSearchStore = create(
  persist<StoreState>(
    (set, get) => ({
      keywords: [],
      selectedCourses: [],
      apiResults: [],

      setKeywords: (keywords) => set({ keywords }),
      setSelectedCourses: (courses) => set({ selectedCourses: courses }),

      setApiResults: (results) => set({ apiResults: results }),

      addApiResult: (newResult) => {
        const { apiResults } = get();
        set({ apiResults: [...apiResults, newResult] });
      },
    }),
    {
      name: "audit-storage",
    }
  )
);

export default useSearchStore;
