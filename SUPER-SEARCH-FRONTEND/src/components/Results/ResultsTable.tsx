/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getCourseName, getProgramName } from '../../utils/resultFormatters';

type SortField = 'courseName' | 'collegeName' | 'matchedKeywords';
type SortDirection = 'asc' | 'desc';

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

interface ResultsTableProps {
  finalResults: AnalysisResult[];
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  handleMoreDetails: (id: string) => void;
  courses: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  finalResults,
  sortField,
  sortDirection,
  handleSort,
  handleMoreDetails,
  courses
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const hasProgramResults = finalResults.some(res => res.content_type === "program");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {hasProgramResults ? (
            <>
              <TableHead className="w-[120px]">Program ID</TableHead>
              <TableHead className="w-[80px]">Version</TableHead>
              <TableHead 
                className="w-[300px] cursor-pointer"
                onClick={() => handleSort('courseName')}
              >
                <div className="flex items-center">
                  Program Name
                  {renderSortIcon('courseName')}
                </div>
              </TableHead>
              <TableHead 
                className="w-[150px] cursor-pointer"
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
              <TableHead className="w-[120px]">Program Link</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </>
          ) : (
            <>
              <TableHead className="w-[120px]">Course Code</TableHead>
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
                className="w-[150px] cursor-pointer"
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
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {finalResults.length === 0 ? (
          <TableRow>
            <TableCell colSpan={hasProgramResults ? 7 : 6} className="text-center py-8 text-muted-foreground">
              No results found. Try adjusting your filters.
            </TableCell>
          </TableRow>
        ) : (
          finalResults.map((res) => {
            const isProgram = res.content_type === "program";
            
            if (isProgram) {
              const programIdParts = res.source_id.split('-v');
              const programId = programIdParts[0];
              const programVersion = programIdParts.length > 1 ? programIdParts[1] : 'N/A';
              
              const programName = res.metadata?.programTitle || getProgramName(res.original_text);
              const collegeName = res.metadata?.programCollege || "N/A";
              const matchedKeywords = (res.keywords_matched || []).join(", ");
              const programLink = res.metadata?.programURL || 
                `https://www.phoenix.edu/programs/${programId.toLowerCase().replace('/', '-')}.html`;

              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium truncate max-w-[120px]">{programId}</TableCell>
                  <TableCell className="font-medium">{programVersion}</TableCell>
                  <TableCell className="break-words max-w-[300px]">
                    <div className="line-clamp-3 hover:line-clamp-none">
                      {programName}
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">{collegeName}</TableCell>
                  <TableCell className="break-words max-w-[200px]">
                    <div className="line-clamp-2 hover:line-clamp-none">
                      {matchedKeywords}
                    </div>
                  </TableCell>
                  <TableCell>
                    {programLink ? (
                      <a
                        href={programLink}
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
                      style={{ backgroundColor: "rgb(0, 179, 115)" }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            } else {
              const courseCode = res.source_id;
              const courseName = getCourseName(res.original_text);
              const courseData = courses.find(course => course.code === courseCode);
              const collegeName = courseData?.collegeName || res.metadata?.programCollege || "N/A";
              const matchedKeywords = (res.keywords_matched || []).join(", ");
              const courseLink = res.metadata?.courseLink || "";

              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium truncate max-w-[120px]">{courseCode}</TableCell>
                  <TableCell className="break-words max-w-[450px]">
                    <div className="line-clamp-3 hover:line-clamp-none">
                      {courseName}
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">{collegeName}</TableCell>
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
                      style={{ backgroundColor: "rgb(0, 179, 115)" }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }
          })
        )}
      </TableBody>
    </Table>
  );
};

export default ResultsTable;