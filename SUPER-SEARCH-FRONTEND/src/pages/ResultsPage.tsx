/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../stores/useSearchStore";
import { useAllCourses } from '../hooks/useAllCourses';
import ResultsFilter from '../components/Results/ResultsFilter';
import ResultsTable from '../components/Results/ResultsTable';
import { escapeCSV, getCourseName, getProgramName } from '../utils/resultFormatters';

interface AnalysisResult {
  id: string;
  source_id: string;
  content_type: string;
  original_text: string;
  keywords_searched: string[];
  keywords_matched: string[];
  metadata?: {
    [key: string]: any;
  };
  [key: string]: any; 
}

type SortField = 'courseName' | 'collegeName' | 'matchedKeywords';
type SortDirection = 'asc' | 'desc';

export default function ResultsPage() {
  const navigate = useNavigate();
  const apiResult = useSearchStore((state: any) => state.apiResult);
  const { courses } = useAllCourses(); 

  const [resultsData, setResultsData] = useState<AnalysisResult[]>([]);
  const [filterText, setFilterText] = useState("");
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>('courseName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    if (!apiResult) return;
    const dataArray = Array.isArray(apiResult) ? apiResult : [apiResult];
    setResultsData(dataArray);
  }, [apiResult]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredResults = resultsData.filter((res) => {
    const textLower = filterText.toLowerCase();
    const courseCode = (res.source_id || "").toLowerCase();
    const originalText = (res.original_text || "").toLowerCase();
    const matchedKeywordsStr = (res.keywords_matched || []).join(", ").toLowerCase();
    const collegeName = (res.metadata?.programCollege || "N/A").toLowerCase();

    const passesMainFilter =
      courseCode.includes(textLower) ||
      originalText.includes(textLower) ||
      matchedKeywordsStr.includes(textLower) ||
      collegeName.includes(textLower);

    const passMatchedOnly = showMatchedOnly
      ? (res.keywords_matched || []).length > 0
      : true;

    return passesMainFilter && passMatchedOnly;
  });

  const finalResults = [...filteredResults].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;

    switch (sortField) {
      case 'courseName': {
        const aName = a.content_type === 'program' 
          ? getProgramName(a.original_text) 
          : getCourseName(a.original_text);
        const bName = b.content_type === 'program' 
          ? getProgramName(b.original_text) 
          : getCourseName(b.original_text);
        return aName.localeCompare(bName) * direction;
      }

      case 'collegeName': {
        const aCollege = (a.metadata?.programCollege || "N/A");
        const bCollege = (b.metadata?.programCollege || "N/A");
        return aCollege.localeCompare(bCollege) * direction;
      }

      case 'matchedKeywords': {
        const aKeywords = (a.keywords_matched || []).length;
        const bKeywords = (b.keywords_matched || []).length;
        return (aKeywords - bKeywords) * direction;
      }

      default:
        return 0;
    }
  });

  const handleMoreDetails = (resultId: string) => {
    navigate(`/results/${resultId}`);
  };

  const handleExportCSV = () => {
    if (finalResults.length === 0) return;
  
    const hasProgramResults = finalResults.some(res => res.content_type === "program");
    
    let header;
    if (hasProgramResults) {
      header = ["Program_ID", "Version", "Program_Name", "College_Name", "Keywords_Matched", "Program_Link"];
    } else {
      header = ["Course_Code", "Course_Name", "College_Name", "Keywords_Matched", "Course_Link"];
    }
  
    const rows = finalResults.map((res) => {
      const isProgram = res.content_type === "program";
      
      if (isProgram) {
        const programIdParts = res.source_id.split('-v');
        const programId = programIdParts[0];
        const programVersion = programIdParts.length > 1 ? programIdParts[1] : 'N/A';
        
        const programName = res.metadata?.programTitle || getProgramName(res.original_text);
        const collegeName = res.metadata?.programCollege || "N/A";
        const matchedKeywords = (res.keywords_matched || []).join(",");
        const programLink = res.metadata?.programURL || 
          `https://www.phoenix.edu/programs/${programId.toLowerCase().replace('/', '-')}.html`;
        
        return [programId, programVersion, programName, collegeName, matchedKeywords, programLink];
      } else {
        const courseCode = res.source_id;
        const courseName = getCourseName(res.original_text);
        const courseData = courses.find(course => course.code === courseCode);
        const collegeName = courseData?.collegeName || res.metadata?.programCollege || "N/A";
        const matchedKeywords = (res.keywords_matched || []).join(",");
        const courseLink = res.metadata?.courseLink || 
          `https://phoenix.edu/courses/${courseCode.replace('/', '-')}`;
        
        return [courseCode, courseName, collegeName, matchedKeywords, courseLink];
      }
    });
  
    const csvLines = [
      header.join(","),
      ...rows.map((r) => r.map(escapeCSV).join(",")),
    ].join("\n");
  
    const blob = new Blob([csvLines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalResults.some(res => res.content_type === "program") ? "program_results.csv" : "course_results.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 overflow-x-auto whitespace-normal">
      <ResultsFilter 
        filterText={filterText}
        setFilterText={setFilterText}
        showMatchedOnly={showMatchedOnly}
        setShowMatchedOnly={setShowMatchedOnly}
        handleExportCSV={handleExportCSV}
      />

      <div className="mb-4 text-sm text-muted-foreground">
        Showing {finalResults.length} of {resultsData.length} results
      </div>

      <ResultsTable 
        finalResults={finalResults}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleMoreDetails={handleMoreDetails}
        courses={courses}
      />
    </div>
  );
}