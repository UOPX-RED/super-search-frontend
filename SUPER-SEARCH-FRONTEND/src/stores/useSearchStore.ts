import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface HighlightedSection {
  start_index: number;
  end_index: number;
  matched_text: string;
  reason: string;
  confidence: number;
  column_matched?: string;
}

export interface ApiResult {
  id: string;
  request_id: string;
  source_id: string;
  content_type: string;
  original_text: string;
  keywords_searched: string[];
  highlighted_sections: HighlightedSection[];
  has_flags: string;
  metadata: {
    programId?: string;
    searchType?: 'hybrid' | 'keyword' | 'concept';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  created_at: string;
  keywords_matched: string[];
  searchType: 'hybrid' | 'keyword' | 'concept';
  csvData?: Record<string, string>;
  csvHeaders?: string[];
  csvRowIndex?: number;
  fileName?: string;
}

interface StoreState {
  keywords: string[];
  selectedCourses: string[];
  apiResult: ApiResult[];
  searchType: 'hybrid' | 'keyword' | 'concept';
  resultIds: string[];

  setKeywords: (keywords: string[]) => void;
  setSelectedCourses: (courses: string[]) => void;
  setApiResult: (results: ApiResult[]) => void;
  addApiResult: (newResult: ApiResult) => void;
  setSearchType: (type: 'hybrid' | 'keyword' | 'concept') => void;
  setResultIds: (ids: string[]) => void;
  
  clearResults: () => void;
}

const customStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;
      
      const parsed = JSON.parse(value);
      if (parsed.state) {
        parsed.state.apiResult = [];
      }
      return JSON.stringify(parsed);
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      
      if (parsed.state) {
        const resultIds = parsed.state.apiResult && Array.isArray(parsed.state.apiResult) ? 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parsed.state.apiResult.map((item: any) => item?.id || '') : [];
        
        parsed.state.resultIds = resultIds;
        parsed.state.apiResult = [];
      }
      
      localStorage.setItem(name, JSON.stringify(parsed));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

const useSearchStore = create(
  persist<StoreState>(
    (set) => ({
      keywords: [],
      selectedCourses: [],
      apiResult: [],
      searchType: 'hybrid',
      resultIds: [],

      setKeywords: (keywords) => set({ keywords }),
      setSelectedCourses: (courses) => set({ selectedCourses: courses }),
      setApiResult: (results) => {
        try {
          const resultIds = results.map(result => result.id);
          
          set({ apiResult: results, resultIds });
          
          // console.log(`Stored ${results.length} results in memory, IDs: ${resultIds.length}`);
        } catch (error) {
          console.error("Error setting API result:", error);
        }
      },
      addApiResult: (newResult) => set((state) => ({ 
        apiResult: [...state.apiResult, newResult],
        resultIds: [...state.resultIds, newResult.id]
      })),
      setSearchType: (type) => set({ searchType: type }),
      setResultIds: (ids) => set({ resultIds: ids }),
      clearResults: () => set({ apiResult: [], resultIds: [] }),
    }),
    {
      name: "audit-storage",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        keywords: state.keywords,
        selectedCourses: state.selectedCourses,
        searchType: state.searchType,
        resultIds: state.resultIds, 
        apiResult: [], 
        setKeywords: () => {},
        setSelectedCourses: () => {},
        setApiResult: () => {},
        addApiResult: () => {},
        setSearchType: () => {},
        setResultIds: () => {},
        clearResults: () => {},
      }),
    }
  )
);

export default useSearchStore;