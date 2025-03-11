import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  keywords: string[];
  selectedCourses: string[];
  apiResult: ApiResult;
  setKeywords: (keywords: string[]) => void;
  setSelectedCourses: (courses: string[]) => void;
  setApiResult: (result: ApiResult) => void;
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
  };
  created_at: string;
  keywords_matched: string[];
}

interface HighlightedSection {
  start_index: number;
  end_index: number;
  matched_text: string;
  reason: string;
  confidence: number;
}

const useSearchStore = create(
  persist<StoreState>(
    (set) => ({
      keywords: [],
      selectedCourses: [],
      apiResult: {
        id: "",
        request_id: "",
        source_id: "",
        content_type: "",
        original_text: "",
        keywords_searched: [],
        highlighted_sections: [],
        has_flags: false,
        metadata: {
          programId: "",
        },
        created_at: "",
        keywords_matched: [],
      },
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

// {
//     "id": "e1c231fe-1e6b-41e3-b052-5ee603f3a8ef",
//     "request_id": "00ee00bb-c3dd-4f7c-a63d-ee0b555d07ce",
//     "source_id": "123",
//     "content_type": "program",
//     "original_text": "Our university is committed to creating opportunities for all students, regardless of their background. We have implemented several programs to ensure equal access to resources and support services for traditionally underserved populations. Our goal is to build a community where everyone feels welcome and valued, and where diverse perspectives enhance the learning experience for all.",
//     "keywords_searched": [
//         "dei"
//     ],
//     "highlighted_sections": [
//         {
//             "start_index": 46,
//             "end_index": 114,
//             "matched_text": "creating opportunities for all students, regardless of their background",
//             "reason": "This relates to the concept of equity by promoting equal opportunities across different backgrounds.",
//             "confidence": 0.9
//         },
//         {
//             "start_index": 116,
//             "end_index": 228,
//             "matched_text": "We have implemented several programs to ensure equal access to resources and support services for traditionally underserved populations.",
//             "reason": "This directly addresses providing equal access and support for underserved groups, which relates to equity and inclusion.",
//             "confidence": 1
//         },
//         {
//             "start_index": 230,
//             "end_index": 345,
//             "matched_text": "Our goal is to build a community where everyone feels welcome and valued, and where diverse perspectives enhance the learning experience for all.",
//             "reason": "This relates to fostering an inclusive environment that values diversity and promotes a sense of belonging for everyone.",
//             "confidence": 0.9
//         }
//     ],
//     "has_flags": true,
//     "metadata": {
//         "programId": "BSB/A"
//     },
//     "created_at": "2025-03-11T19:01:01.965091",
//     "keywords_matched": [
//         "equity",
//         "inclusion",
//         "diversity"
//     ]
// }
