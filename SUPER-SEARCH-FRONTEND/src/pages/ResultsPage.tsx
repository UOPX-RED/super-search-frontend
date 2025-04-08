/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import useSearchStore from "../stores/useSearchStore";
import { useAllCourses } from '../hooks/useAllCourses';
import ResultsFilter from '../components/Results/ResultsFilter';
import ResultsTable from '../components/Results/ResultsTable';
import { escapeCSV, getCourseName, getProgramName } from '../utils/resultFormatters';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AnalysisResult {
  id: string;
  source_id: string;
  content_type: string;
  original_text: string;
  keywords_searched: string[];
  keywords_matched: string[];
  searchType: 'hybrid' | 'keyword' | 'concept';
  metadata?: {
    [key: string]: any;
  };
  csvData?: Record<string, string>;
  csvHeaders?: string[];
  csvRowIndex?: number;
  fileName?: string;
  [key: string]: any; 
}

type SortField = 'courseName' | 'collegeName' | 'matchedKeywords';
type SortDirection = 'asc' | 'desc';
type SearchType = 'hybrid' | 'keyword' | 'concept';

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const apiResult = useSearchStore((state: any) => state.apiResult);
  const { courses } = useAllCourses(); 

  const searchTypeFromURL = searchParams.get('searchType') as SearchType | null;
  const searchTypeFromState = location.state?.searchType as SearchType | null;
  const searchTypeFromStorage = localStorage.getItem('lastSearchType') as SearchType | null;
  
  const [searchType, setSearchType] = useState<SearchType>(
    searchTypeFromURL || searchTypeFromState || searchTypeFromStorage || 'hybrid'
  );

  const [resultsData, setResultsData] = useState<AnalysisResult[]>([]);
  const [filterText, setFilterText] = useState("");
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>('courseName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isCSVData, setIsCSVData] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  useEffect(() => {
    let finalData = apiResult;
    
    if (!finalData || !finalData.length) {
      const storedResults = localStorage.getItem('auditResults');
      if (storedResults) {
        finalData = JSON.parse(storedResults);
      } else {
        finalData = [];
      }
    }

    const dataArray = Array.isArray(finalData) ? finalData : [finalData];
    
    if (dataArray.length > 0 && dataArray[0].searchType && !searchType) {
      setSearchType(dataArray[0].searchType as SearchType);
    }

    const hasCSVData = dataArray.some(item => item.csvData || item.content_type === 'csv');
    setIsCSVData(hasCSVData);

    if (hasCSVData) {
      const firstWithHeaders = dataArray.find(item => item.csvHeaders && item.csvHeaders.length > 0);
      if (firstWithHeaders && firstWithHeaders.csvHeaders) {
        setCsvHeaders(firstWithHeaders.csvHeaders);
      } else {
        const firstWithData = dataArray.find(item => item.csvData && Object.keys(item.csvData).length > 0);
        if (firstWithData && firstWithData.csvData) {
          setCsvHeaders(Object.keys(firstWithData.csvData));
        }
      }
    }

    setResultsData(dataArray);
  }, [apiResult, searchType]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredResults = resultsData.filter((res) => {
    if (isCSVData && res.csvData) {
      const textLower = filterText.toLowerCase();
      const values = Object.values(res.csvData).map(v => String(v).toLowerCase());
      const anyFieldMatches = values.some(v => v.includes(textLower));
      const matchedKeywordsStr = (res.keywords_matched || []).join(", ").toLowerCase();
      
      const passesMainFilter = anyFieldMatches || matchedKeywordsStr.includes(textLower);
      
      const passMatchedOnly = showMatchedOnly
        ? (res.keywords_matched || []).length > 0
        : true;
        
      return passesMainFilter && passMatchedOnly;
    }
    
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
    if (isCSVData) {
      const aIndex = a.csvRowIndex || 0;
      const bIndex = b.csvRowIndex || 0;
      return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
    }
    
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
    
    if (isCSVData) {
      const analysisHeaders = ["Keywords_Matched", "Confidence_Scores", "Search_Type"];
      const headers = [...csvHeaders, ...analysisHeaders];
      
      const rows = finalResults.map((res) => {
        const rowValues = csvHeaders.map(header => res.csvData?.[header] || "");
        
        const matchedKeywords = (res.keywords_matched || []).join(", ");
        
        const confidenceScores = res.highlighted_sections?.map(
          (section: any) => section.confidence ? Math.round(section.confidence * 100) : 0
        ) || [];
        
        const confidenceDisplay = confidenceScores.length 
          ? confidenceScores.map((score: any) => `${score}%`).join(', ')
          : (res.keywords_searched?.length 
              ? `${Math.round((res.keywords_matched?.length || 0) / res.keywords_searched.length * 100)}%` 
              : "0%");
        
        return [...rowValues, matchedKeywords, confidenceDisplay, res.searchType || searchType];
      });
      
      const csvLines = [
        headers.join(","),
        ...rows.map((r) => r.map(escapeCSV).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvLines], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "csv_analysis_results.csv";
      link.click();
      URL.revokeObjectURL(url);
      
      return;
    }
  
    const hasProgramResults = finalResults.some(res => res.content_type === "program");
    
    let header;
    if (hasProgramResults) {
      header = ["Program_ID", "Version", "Program_Name", "College_Name", "Keywords_Matched", "Search_Type", "Program_Link"];
    } else {
      header = ["Course_Code", "Course_Name", "College_Name", "Keywords_Matched", "Search_Type", "Course_Link"];
    }
  
    const rows = finalResults.map((res) => {
      const isProgram = res.content_type === "program";
      const resultSearchType = res.searchType || searchType;
      
      if (isProgram) {
        const programIdParts = res.source_id.split('-v');
        const programId = programIdParts[0];
        const programVersion = programIdParts.length > 1 ? programIdParts[1] : 'N/A';
        
        const programName = res.metadata?.programTitle || getProgramName(res.original_text);
        const collegeName = res.metadata?.programCollege || "N/A";
        const matchedKeywords = (res.keywords_matched || []).join(",");
        const programLink = res.metadata?.programURL || 
          `https://www.phoenix.edu/programs/${programId.toLowerCase().replace('/', '-')}.html`;
        
        return [programId, programVersion, programName, collegeName, matchedKeywords, resultSearchType, programLink];
      } else {
        const courseCode = res.source_id;
        const courseName = getCourseName(res.original_text);
        const courseData = courses.find(course => course.code === courseCode);
        const collegeName = courseData?.collegeName || res.metadata?.programCollege || "N/A";
        const matchedKeywords = (res.keywords_matched || []).join(",");
        const courseLink = res.metadata?.courseLink || 
          `https://phoenix.edu/courses/${courseCode.replace('/', '-')}`;
        
        return [courseCode, courseName, collegeName, matchedKeywords, resultSearchType, courseLink];
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

  const renderSearchTypeChip = () => {
    const searchTypeInfo = {
      'hybrid': { 
        label: 'Hybrid Search', 
        description: 'AI + Keywords', 
        icon: <AutoAwesomeIcon fontSize="small" />,
        color: '#5E35B1'
      },
      'keyword': { 
        label: 'Keyword Search', 
        description: 'Exact Matches', 
        icon: <SearchIcon fontSize="small" />,
        color: '#1976D2'
      },
      'concept': { 
        label: 'Concept Search', 
        description: 'AI Understanding', 
        icon: <PsychologyIcon fontSize="small" />,
        color: '#00796B'
      }
    };

    const currentType = searchTypeInfo[searchType];

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" fontSize={15} sx={{ mr: 1 }}>
          Search Method:
        </Typography>
        <Chip
          icon={currentType.icon}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 15 }}>
                {currentType.label}
              </Typography>
              <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.8 }}>
                ({currentType.description})
              </Typography>
            </Box>
          }
          size="small"
          sx={{
            backgroundColor: `${currentType.color}15`,
            color: currentType.color,
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: currentType.color
            }
          }}
        />
      </Box>
    );
  };

  const renderCSVResultsTable = () => {
    if (!isCSVData || csvHeaders.length === 0) return null;
    
    const fullHeaders = [
      '#',
      ...csvHeaders,
      'Matched Keywords',
      'Confidence',
      'Search Type',
      'Actions'
    ];
    
    return (
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {fullHeaders.map((header, idx) => (
                <TableCell 
                  key={idx} 
                  sx={{ 
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    color: '#4a5568'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalResults.map((result, idx) => {
              const confidenceScores = result.highlighted_sections?.map(
                (section: any) => section.confidence ? Math.round(section.confidence * 100) : 0
              ) || [];
              
              const confidenceDisplay = confidenceScores.length 
                ? confidenceScores.map((score: any) => `${score}%`).join(', ')
                : (result.keywords_searched?.length 
                    ? `${Math.round((result.keywords_matched?.length || 0) / result.keywords_searched.length * 100)}%` 
                    : "0%");
                
              const resultSearchType = result.searchType || searchType;
              
              return (
                <TableRow 
                  key={result.id || idx}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#f0f9ff' }
                  }}
                >
                  <TableCell>{idx + 1}</TableCell>
                  
                  {csvHeaders.map((header) => (
                    <TableCell key={header}>
                      {result.csvData?.[header] || ''}
                    </TableCell>
                  ))}
                  
                  <TableCell>
                    {(result.keywords_matched || []).join(', ')}
                  </TableCell>
                  
                  <TableCell>
                    {confidenceDisplay}
                  </TableCell>
                  
                  <TableCell>
                    {resultSearchType}
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleMoreDetails(result.id)}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#3182ce',
                        color: '#3182ce'
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const ModifiedResultsTable = () => {
    if (!finalResults || finalResults.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No results found</Typography>
        </Box>
      );
    }
    
    try {
      return (
        <ResultsTable 
          finalResults={finalResults}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleMoreDetails={handleMoreDetails}
          courses={courses || []}
          searchType={searchType}
        />
      );
    } catch (error) {
      console.error("Error rendering ResultsTable:", error);
      return (
        <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
          <Typography variant="body1">
            Error displaying results table. Try refreshing the page.
          </Typography>
        </Box>
      );
    }
  };

  return (
    <div className="p-6 overflow-x-auto whitespace-normal">
      {renderSearchTypeChip()}
      
      <ResultsFilter 
        filterText={filterText}
        setFilterText={setFilterText}
        showMatchedOnly={showMatchedOnly}
        setShowMatchedOnly={setShowMatchedOnly}
        handleExportCSV={handleExportCSV}
      />

      <div className="mb-4 text-sm text-muted-foreground">
        Showing {finalResults.length} of {resultsData.length} results
        {isCSVData && finalResults.length > 0 && (
          <span> from CSV file: {finalResults[0].fileName || 'uploaded file'}</span>
        )}
      </div>
      
      {isCSVData ? (
        renderCSVResultsTable()
      ) : (
        <ModifiedResultsTable />
      )}
    </div>
  );
}
