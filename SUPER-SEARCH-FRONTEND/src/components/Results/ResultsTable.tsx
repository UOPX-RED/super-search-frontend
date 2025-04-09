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
  searchType?: 'hybrid' | 'keyword' | 'concept';
  getMatchSource?: (result: any) => string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  finalResults,
  sortField,
  sortDirection,
  handleSort,
  handleMoreDetails,
  courses}) => {

  const findSectionForKeyword = (originalText: string, keyword: string): string[] => {
    if (!originalText || !keyword) return ['Content'];
    
    const keywordLower = keyword.toLowerCase();
    const sectionMarkers = [
      { marker: '[[SECTION:COURSE_TITLE]]', name: 'Course Title' },
      { marker: '[[SECTION:COURSE_DESCRIPTION]]', name: 'Course Description' },
      { marker: '[[SECTION:COURSE_OBJECTIVES]]', name: 'Course Objectives' },
      { marker: '[[SECTION:LEARNING_OUTCOMES]]', name: 'Learning Outcomes' },
      { marker: '[[SECTION:PREREQUISITES]]', name: 'Prerequisites' },
      { marker: '[[SECTION:PROGRAM_TITLE]]', name: 'Program Title' },
      { marker: '[[SECTION:PROGRAM_DESCRIPTION]]', name: 'Program Description' },
      { marker: '[[SECTION:PROGRAM_FORMATTED_DESCRIPTION]]', name: 'Program Description' },
      { marker: '[[SECTION:PROGRAM_LEVEL]]', name: 'Program Level' },
      { marker: '[[SECTION:PROGRAM_REQUIREMENTS]]', name: 'Program Requirements' },
      { marker: '[[SECTION:LEARNING_OUTCOMES]]', name: 'Learning Outcomes' },
      { marker: '[[SECTION:PROGRAM_COLLEGE]]', name: 'Program College' },
    ];
    
    const sources = new Set<string>();
    
    const sections: {start: number, end: number, name: string}[] = [];
    let lastMarkerEnd = 0;
    
    sectionMarkers.forEach(({marker, name}) => {
      const markerIndex = originalText.indexOf(marker);
      if (markerIndex >= 0) {
        let endIndex = originalText.length;
        for (const {marker: nextMarker} of sectionMarkers) {
          const nextMarkerIndex = originalText.indexOf(nextMarker, markerIndex + marker.length);
          if (nextMarkerIndex > markerIndex) {
            endIndex = Math.min(endIndex, nextMarkerIndex);
          }
        }
        
        sections.push({
          start: markerIndex + marker.length,
          end: endIndex,
          name: name
        });
        
        lastMarkerEnd = Math.max(lastMarkerEnd, endIndex);
      }
    });
    
    sections.sort((a, b) => a.start - b.start);
    
    let keywordIndex = originalText.toLowerCase().indexOf(keywordLower);
    while (keywordIndex >= 0) {
      let foundSection = false;
      for (const section of sections) {
        if (keywordIndex >= section.start && keywordIndex < section.end) {
          sources.add(section.name);
          foundSection = true;
          break;
        }
      }
      
      if (!foundSection) {
        const contextStart = Math.max(0, keywordIndex - 100);
        const contextEnd = Math.min(originalText.length, keywordIndex + 100);
        const context = originalText.substring(contextStart, contextEnd).toLowerCase();
        
        if (context.includes("title") || keywordIndex < 200) {
          sources.add('Title');
        } else if (context.includes("description")) {
          sources.add('Description');
        } else if (context.includes("objectives")) {
          sources.add('Objectives');
        } else if (context.includes("outcomes")) {
          sources.add('Learning Outcomes');
        } else if (context.includes("prerequisites")) {
          sources.add('Prerequisites');
        } else if (context.includes("requirements")) {
          sources.add('Requirements');
        } else {
          sources.add('Content');
        }
      }
      
      keywordIndex = originalText.toLowerCase().indexOf(keywordLower, keywordIndex + 1);
    }
    
    return Array.from(sources);
  };

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
              <TableHead className="w-[120px]">Confidence</TableHead>
              <TableHead className="w-[250px]">Match Source</TableHead>
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
              <TableHead className="w-[120px]">Confidence</TableHead>
              <TableHead className="w-[250px]">Match Source</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {finalResults.length === 0 ? (
          <TableRow>
            <TableCell colSpan={hasProgramResults ? 9 : 8} className="text-center py-8 text-muted-foreground">
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
              const confidenceScores = res.highlighted_sections?.map(
                (section: any) => section.confidence ? Math.round(section.confidence * 100) : 0
              ) || [];
              const confidence = confidenceScores.length 
                ? confidenceScores.map((score: any) => `${score}%`).join(', ')
                : (res.keywords_searched?.length 
                    ? `${Math.round((res.keywords_matched?.length || 0) / res.keywords_searched.length * 100)}%` 
                    : "0%");

              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium truncate max-w-[120px]">{programId}</TableCell>
                  <TableCell className="font-medium">{programVersion}</TableCell>
                  <TableCell className="break-words">
                    <div className="w-full break-words whitespace-normal">
                      {programName}
                    </div>
                  </TableCell>
                  <TableCell className="break-words">
                    <div className="w-full break-words whitespace-normal">
                      {collegeName}
                    </div>
                  </TableCell>
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
                  <TableCell>{confidence}</TableCell>
                  <TableCell className="break-words max-w-[250px]">
                    <div className="whitespace-normal">
                      {res.keywords_matched && res.keywords_matched.length > 0 ? (
                        <div className="space-y-1">
                          {res.keywords_matched.map((keyword: string, i: number) => {
                            const keywordLower = keyword.toLowerCase();
                            const sources: string[] = [];
                            
                            if (res.original_text) {
                              const detectedSections = findSectionForKeyword(res.original_text, keyword);
                              detectedSections.forEach(section => sources.push(section));
                            }
                            
                            if (sources.length === 0 && res.highlighted_sections && res.highlighted_sections.length > 0) {
                              const matchingSections = res.highlighted_sections.filter(
                                (section: any) => section.matched_text?.toLowerCase().includes(keywordLower)
                              );
                              
                              for (const section of matchingSections) {
                                if (section.section_matched) {
                                  if (!section.section_matched.toLowerCase().includes('url')) {
                                    sources.push(section.section_matched);
                                  }
                                }
                              }
                            }
                            
                            if (sources.length === 0 && res.metadata) {
                              if ((res.metadata.programTitle && 
                                   res.metadata.programTitle.toLowerCase().includes(keywordLower)) ||
                                  (res.metadata.displayName &&
                                   res.metadata.displayName.toLowerCase().includes(keywordLower))) {
                                sources.push("Program Title");
                              }
                              
                              if ((res.metadata.programDescription && 
                                   res.metadata.programDescription.toLowerCase().includes(keywordLower)) ||
                                  (res.metadata.textDescription &&
                                   res.metadata.textDescription.toLowerCase().includes(keywordLower)) ||
                                  (res.metadata.formattedDescription &&
                                   res.metadata.formattedDescription.toLowerCase().includes(keywordLower))) {
                                sources.push("Program Description");
                              }
                              
                              if (res.metadata.programCollege && 
                                  res.metadata.programCollege.toLowerCase().includes(keywordLower)) {
                                sources.push("Program College");
                              }
                              
                              if (res.metadata.learningOutcomes && 
                                  res.metadata.learningOutcomes.toLowerCase().includes(keywordLower)) {
                                sources.push("Learning Outcomes");
                              }
                              
                              if (res.metadata.requirements && 
                                  res.metadata.requirements.toLowerCase().includes(keywordLower)) {
                                sources.push("Program Requirements");
                              }
                            }
                            
                            if (sources.length === 0 && res.highlighted_sections && res.highlighted_sections.length > 0) {
                              for (const section of res.highlighted_sections) {
                                if (!section.matched_text?.toLowerCase().includes(keywordLower)) continue;
                                
                                const matchedText = section.matched_text || '';
                                const startPos = res.original_text.indexOf(matchedText);
                                
                                if (startPos >= 0) {
                                  const contextBefore = res.original_text.substring(
                                    Math.max(0, startPos - 200), 
                                    startPos
                                  ).toLowerCase();
                                  
                                  if (contextBefore.includes("program title:") || 
                                      contextBefore.includes("program name:")) {
                                    sources.push("Program Title");
                                  } 
                                  else if (contextBefore.includes("program description:") || 
                                           contextBefore.includes("description:")) {
                                    sources.push("Program Description");
                                  }
                                  else if (contextBefore.includes("learning outcomes:") || 
                                           contextBefore.match(/outcomes\s*:/i)) {
                                    sources.push("Learning Outcomes");
                                  }
                                  else if (contextBefore.includes("program requirements:") || 
                                           contextBefore.includes("requirements:")) {
                                    sources.push("Program Requirements");
                                  }
                                  else if (contextBefore.includes("college:") || 
                                           contextBefore.includes("school:")) {
                                    sources.push("Program College");
                                  }
                                  else {
                                    if (startPos < 300 && !contextBefore.includes(".")) {
                                      sources.push("Program Title");
                                    } else if (startPos < 1000) {
                                      sources.push("Program Description");
                                    } else {
                                      sources.push("Program Content");
                                    }
                                  }
                                }
                              }
                            }
                            
                            if (sources.length === 0 && programName && 
                                programName.toLowerCase().includes(keywordLower)) {
                              sources.push("Program Title");
                            }
                            
                            const uniqueSources = Array.from(new Set(sources));
                            const displaySource = uniqueSources.length > 0 
                              ? uniqueSources.join(", ") 
                              : "Program Content";
                            
                            return (
                              <div key={i} className="text-xs py-0.5">
                                <span className="font-medium">{keyword}:</span>{' '}
                                <span className="text-gray-700">{displaySource}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : '-'}
                    </div>
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
              const confidenceScores = res.highlighted_sections?.map(
                (section: any) => section.confidence ? Math.round(section.confidence * 100) : 0
              ) || [];
              const confidence = confidenceScores.length 
                ? confidenceScores.map((score: any) => `${score}%`).join(', ')
                : (res.keywords_searched?.length 
                    ? `${Math.round((res.keywords_matched?.length || 0) / res.keywords_searched.length * 100)}%` 
                    : "0%");

              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium truncate max-w-[120px]">{courseCode}</TableCell>
                  <TableCell className="break-words">
                    <div className="w-full break-words whitespace-normal">
                      {courseName}
                    </div>
                  </TableCell>
                  <TableCell className="break-words">
                    <div className="w-full break-words whitespace-normal">
                      {collegeName}
                    </div>
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
                  <TableCell>{confidence}</TableCell>
                  <TableCell className="break-words max-w-[250px]">
                    <div className="whitespace-normal">
                      {res.keywords_matched && res.keywords_matched.length > 0 ? (
                        <div className="space-y-1">
                          {res.keywords_matched.map((keyword: string, i: number) => {
                            const keywordLower = keyword.toLowerCase();
                            const sources: string[] = [];
                            
                            if (res.original_text) {
                              const detectedSections = findSectionForKeyword(res.original_text, keyword);
                              detectedSections.forEach(section => sources.push(section));
                            }
                            
                            if (courseName && courseName.toLowerCase().includes(keywordLower)) {
                              sources.push("Course Title");
                            }
                            
                            if (courseCode && courseCode.toLowerCase().includes(keywordLower)) {
                              sources.push("Course Code");
                            }
                            
                            if (courseData) {
                              if (courseData.description && 
                                  courseData.description.toLowerCase().includes(keywordLower)) {
                                sources.push("Course Description");
                              }
                              
                              if (courseData.objectives && 
                                  courseData.objectives.toLowerCase().includes(keywordLower)) {
                                sources.push("Course Objectives");
                              }
                              
                              if (courseData.learningOutcomes && 
                                  courseData.learningOutcomes.toLowerCase().includes(keywordLower)) {
                                sources.push("Learning Outcomes");
                              }
                              
                              if (courseData.prerequisites && 
                                  courseData.prerequisites.toLowerCase().includes(keywordLower)) {
                                sources.push("Prerequisites");
                              }
                            }
                            
                            if (sources.length === 0 && res.highlighted_sections && res.highlighted_sections.length > 0) {
                              const sectionMatches: Record<string, boolean> = {};
                              
                              for (const section of res.highlighted_sections) {
                                if (!section.matched_text?.toLowerCase().includes(keywordLower)) continue;
                                
                                if (section.section_matched) {
                                  sectionMatches[section.section_matched] = true;
                                  continue;
                                }
                                
                                const matchedText = section.matched_text;
                                const startPos = res.original_text.indexOf(matchedText);
                                
                                if (startPos >= 0) {
                                  const contextBefore = res.original_text.substring(
                                    Math.max(0, startPos - 200), 
                                    startPos
                                  ).toLowerCase();
                                  
                                  if (contextBefore.includes("course title:") || 
                                      contextBefore.includes("course name:")) {
                                    sectionMatches["Course Title"] = true;
                                  }
                                  else if (contextBefore.includes("course description:") || 
                                           contextBefore.includes("description:")) {
                                    sectionMatches["Course Description"] = true;
                                  }
                                  else if (contextBefore.includes("objectives:") || 
                                           contextBefore.includes("course objectives:")) {
                                    sectionMatches["Course Objectives"] = true;
                                  }
                                  else if (contextBefore.includes("learning outcomes:") || 
                                           contextBefore.includes("outcomes:")) {
                                    sectionMatches["Learning Outcomes"] = true;
                                  }
                                  else if (contextBefore.includes("prerequisites:")) {
                                    sectionMatches["Prerequisites"] = true;
                                  }
                                  else {
                                    if (startPos < 300 && matchedText.length < 100) {
                                      sectionMatches["Course Title"] = true;
                                    } else if (startPos < 800) {
                                      sectionMatches["Course Description"] = true;
                                    } else {
                                      sectionMatches["Course Content"] = true;
                                    }
                                  }
                                }
                              }
                              
                              Object.keys(sectionMatches).forEach(section => {
                                sources.push(section);
                              });
                            }
                            
                            const uniqueSources = Array.from(new Set(sources));
                            const displaySource = uniqueSources.length > 0 
                              ? uniqueSources.join(", ") 
                              : "Course Content";
                            
                            return (
                              <div key={i} className="text-xs py-0.5">
                                <span className="font-medium">{keyword}:</span>{' '}
                                <span className="text-gray-700">{displaySource}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : '-'}
                    </div>
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