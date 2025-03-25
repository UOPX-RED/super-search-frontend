import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";

import useSearchStore from "../stores/useSearchStore";
import { useAllCourses } from '../hooks/useAllCourses';

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
  const { apiResult } = useSearchStore((state) => state);
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
        const aName = getCourseName(a.original_text);
        const bName = getCourseName(b.original_text);
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

    const header = ["Course_Code", "College_Name", "Keywords_Matched", "Original_Text", "Course_Link"];

    const rows = finalResults.map((res) => {
      const cCode = res.source_id;
      
      const courseData = courses.find(course => course.code === cCode);
      const cName = courseData?.collegeName || res.metadata?.programCollege || "N/A";
      
      const mk = (res.keywords_matched || []).join(",");
      const orig = (res.original_text || "").replace(/\n/g, " ");
      const cLink = res.metadata?.courseLink || "N/A";
      return [cCode, cName, mk, orig, cLink];
    });

    const csvLines = [
      header.join(","),
      ...rows.map((r) => r.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvLines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "results.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="p-6 overflow-x-auto whitespace-normal">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col">
          <Input
            placeholder="Filter results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-247 mb-5"
          />

          <div className="flex items-center space-x-3">
            <div 
              onClick={() => setShowMatchedOnly(!showMatchedOnly)}
              className="relative inline-block w-10 h-5 rounded-full cursor-pointer"
            >
              <div 
                className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                  showMatchedOnly ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
              <div 
                className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                  showMatchedOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </div>
            
            <label 
              onClick={() => setShowMatchedOnly(!showMatchedOnly)}
              className="text-sm font-medium cursor-pointer"
            >
              Show only matched results
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">

           <Button 
            onClick={handleExportCSV}
            className="app-button bg-primary hover:bg-primary/90 h-9"
            style={{ backgroundColor: "rgb(0, 179, 115)" }}
          >
            Export CSV
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="app-button flex items-center gap-1"
            style={{ backgroundColor: "rgb(0, 0, 0)" }}
          >
            <Plus className="h-4 w-4" />
            New Audit
          </Button>

         
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Showing {finalResults.length} of {resultsData.length} results
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">
              <div className="flex items-center">
                Course Code
              </div>
            </TableHead>

            <TableHead 
              className="w-[450px] cursor-pointer"
              onClick={() => handleSort('courseName')}
            >
              <div className="flex items-center">
                Course Name
                {renderSortIcon('courseName')}
              </div>
            </TableHead>

            <TableHead 
              className="w-[350px] cursor-pointer"
              onClick={() => handleSort('collegeName')}
            >
              <div className="flex items-center">
                College Name
                {renderSortIcon('collegeName')}
              </div>
            </TableHead>

            <TableHead 
              className="w-[200px] cursor-pointer"
              onClick={() => handleSort('matchedKeywords')}
            >
              <div className="flex items-center">
                Matching Keywords
                {renderSortIcon('matchedKeywords')}
              </div>
            </TableHead>

            <TableHead className="w-[120px]">Course Link</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finalResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No results found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            finalResults.map((res) => {
              const courseCode = res.source_id;
              const courseName = getCourseName(res.original_text);
              
              const courseData = courses.find(course => course.code === courseCode);
              const collegeName = courseData?.collegeName || res.metadata?.programCollege || "N/A";
              
              const matchedKeywords = (res.keywords_matched || []).join(", ");
              const courseLink = res.metadata?.courseLink || "";

              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium truncate max-w-[120px]">
                    {courseCode}
                  </TableCell>
                  <TableCell className="break-words max-w-[450px]">
                    <div className="line-clamp-3 hover:line-clamp-none">
                      {courseName}
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">
                    {collegeName}
                  </TableCell>
                  <TableCell className="break-words max-w-[200px]">
                    <div className="line-clamp-2 hover:line-clamp-none">
                      {matchedKeywords}
                    </div>
                  </TableCell>
                  <TableCell>
                    {courseLink ? (
                      <a
                        href={courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600"
                      >
                        Link
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleMoreDetails(res.id)}
                      className="app-button"
                      style={{ backgroundColor: "rgb(0, 179, 115)" }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function escapeCSV(str: string) {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getCourseName(originalText: string) {
  if (!originalText) return "Unknown Course";

  const splitted = originalText.split("This course");
  if (splitted.length > 1) {
    const courseName = splitted[0].trim();
    return courseName.length > 100 ? courseName.slice(0, 100) + "..." : courseName;
  }
  return originalText.slice(0, 40) + "...";
}