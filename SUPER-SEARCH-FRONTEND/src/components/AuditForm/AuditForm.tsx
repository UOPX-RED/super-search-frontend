/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import TabSwitcherMUI from "../TabSwitcher/tabswitcher";
import TagInput from "../TagInput/taginput";
import ManualInputView from "../ManualInputView/ManualInputView";
import AutoScanView from "../AutoScanView/AutoScanView";
import SearchTypeSelector from "../SearchTypeSelector/SearchTypeSelector";
import axios from "axios";
import { useCourseInfo } from "../../hooks/useCourseInfo";
import { useProgramDetails, ProgramDetailResponse } from "../../hooks/useProgramDetails";
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from "react-router-dom";
import useSearchStore from "../../stores/useStore";

interface Program {
  code: string;
  title: string;
  collegeName: string;
  levelName: string;
  isActive: boolean;
}

type SearchType = 'hybrid' | 'keyword' | 'concept';

const AuditForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"MANUAL" | "AUTO">("MANUAL");
  const { setApiResult } = useSearchStore.getState();
  const { getCourseDetails } = useCourseInfo();
  const { getProgramDetails } = useProgramDetails();

  const [searchType, setSearchType] = useState<SearchType>("hybrid");

  const [keywords, setKeywords] = useState<string[]>([]);
  const [manualText, setManualText] = useState("");
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseContents, setCourseContents] = useState<{ [key: string]: string }>({});
  const [courseCode] = useState("");

  const [selectedProgramData, setSelectedProgramData] = useState<Program | null>(null);
  const [programContents, setProgramContents] = useState<{ [key: string]: ProgramDetailResponse }>({});
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [csvData, setCsvData] = useState<any[]>([]);
  const [isCsvMode, setIsCsvMode] = useState(false);

  const isFormValid =
    activeTab === "AUTO"
      ? (selectedCourses.length > 0 || courseCode || selectedPrograms.length > 0) && keywords.length > 0
      : activeTab === "MANUAL"
      ? (manualText.trim() !== "" || (isCsvMode && csvData.length > 0)) && keywords.length > 0
      : (selectedCourses.length > 0 || selectedPrograms.length > 0) && keywords.length > 0;

  const handleAddTag = (tag: string) => {
    setKeywords((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tag: string) => {
    setKeywords((prev) => prev.filter((item) => item !== tag));
  };

  const handleCourseSelection = (code: string) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(code)
        ? prevSelected.filter((existing) => existing !== code)
        : [...prevSelected, code]
    );
  };

  const handleCourseContentFetched = (content: string, code: string) => {
    setCourseContents((prev) => ({ ...prev, [code]: content }));
  };

  const handleProgramSelect = (programData: Program | null) => {
    setSelectedProgramData(programData);
  };

  const handleProgramSelection = (programId: string) => {
    setSelectedPrograms((prevSelected) =>
      prevSelected.includes(programId)
        ? prevSelected.filter((existing) => existing !== programId)
        : [...prevSelected, programId]
    );
  };

  const handleProgramContentFetched = (content: ProgramDetailResponse, programId: string) => {
    setProgramContents((prev) => ({ ...prev, [programId]: content }));
  };

  const handleCsvDataProcessed = (data: any[]) => {
    setCsvData(data);
    setIsCsvMode(true);
  };

  const submitAudit = async (data: any) => {
    try {
      const token = localStorage.getItem("userToken");
      if (token) {
        axios.defaults.headers.common["X-Azure-Token"] = token;
      }
      
      let endpoint;
      switch (searchType) {
        case 'keyword':
          endpoint = "api/keywordsearch";
          break;
        case 'concept':
          endpoint = "api/conceptsearch";
          break;
        case 'hybrid':
        default:
          endpoint = "api/analyze";
          break;
      }
      
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await axios.post(`${BACKEND_URL}/${endpoint}`, data);

      return response.data;
    } catch (error) {
      console.error(`Error submitting audit to ${searchType} endpoint`, error);
      throw error;
    }
  };

  const fetchCourseText = async (cCode: string) => {
    if (courseContents[cCode]) {
      return courseContents[cCode];
    }
    try {
      return await getCourseDetails(cCode);
    } catch (error) {
      console.error(`Error fetching course ${cCode}:`, error);
      return `Error: Could not load details for course ${cCode}.`;
    }
  };

  const createProgramTextContent = (programDetail: ProgramDetailResponse): string => {
    return `${programDetail.displayName}\n\n${programDetail.textDescription}\n\n${programDetail.formattedDescription}`;
  };

  const prepareMetadata = (cCode?: string, programId?: string) => {
    let metadata: Record<string, any> = {
      [metadataKey.trim() || "programId"]: metadataValue.trim() || "FIN-PM-001",
      searchType: searchType, 
    };

    const metadataElement = document.getElementById("allMetadata") as HTMLInputElement;
    if (metadataElement && metadataElement.value) {
      try {
        const parsed = JSON.parse(metadataElement.value);
        if (Object.keys(parsed).length > 0) {
          metadata = { ...parsed, searchType };
        }
      } catch (e) {
        console.error("Error parsing metadata:", e);
      }
    }

    if (cCode) {
      const [prefix, number] = cCode.split("/");
      const courseURL =
        prefix && number
          ? `https://www.phoenix.edu/online-courses/${prefix}${number}.html`
          : "";
      metadata = {
        ...metadata,
        courseCode: cCode,
        ...(courseURL && { courseLink: courseURL }),
      };
    }

    if (programId && programContents[programId]) {
      const programDetail = programContents[programId];
      const programURL = `https://www.phoenix.edu/programs/${programId.toLowerCase().replace('/', '-')}.html`;
      
      metadata = {
        ...metadata,
        programId: programId,
        programTitle: programDetail.displayName,
        programDescription: programDetail.textDescription,
        programLevel: programDetail.programLevelDescription,
        programCollege: programDetail.collegeName,
        programDepartment: programDetail.collegeDepartment,
        programExpirationDate: programDetail.versionExpirationDate,
        programURL: programURL
      };
    } else if (selectedProgramData) {
      metadata = {
        ...metadata,
        programCode: selectedProgramData.code,
        programTitle: selectedProgramData.title,
        programLevel: selectedProgramData.levelName,
        programCollege: selectedProgramData.collegeName,
      };
    }

    return metadata;
  };

  const handleStartAudit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setLoadingMessage("");
    try {
      const allResults = [];

      // MANUAL
      if (activeTab === "MANUAL") {
        if (isCsvMode && csvData.length > 0) {
          for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            setLoadingMessage(`Processing CSV row ${i + 1} of ${csvData.length} using ${searchType} search...`);
            const sourceId = `csv-row-${row.rowIndex}-${Date.now()}`;
            
            const metadata: Record<string, any> = {
              ...prepareMetadata(),
              rowIndex: row.rowIndex,
              sourceType: 'csv',
              fileName: row.fileName || 'uploaded_csv',
              originalHeaders: row.originalHeaders || [],
              searchType: searchType, 
            };
            Object.entries(row.data).forEach(([key, value]) => {
              metadata[`csv_${key}`] = value;
            });
            
            const data = {
              source_id: sourceId,
              content_type: "csv upload",
              text: row.text,
              keywords,
              metadata,
            };
            
            try {
              const result = await submitAudit(data);
              result.csvData = row.data;
              result.csvRowIndex = row.rowIndex;
              result.csvHeaders = row.originalHeaders;
              result.fileName = row.fileName;
              result.searchType = searchType;
              
              allResults.push(result);
            } catch (error) {
              console.error(`Error processing row ${row.rowIndex}:`, error);
              allResults.push({
                id: `error-${sourceId}`,
                error: `Failed to process row ${row.rowIndex}`,
                csvData: row.data,
                csvRowIndex: row.rowIndex,
                csvHeaders: row.originalHeaders,
                fileName: row.fileName,
                status: 'error',
                searchType: searchType 
              });
            }
          }
        } else {
          const analyzeText = manualText;
          const sourceId = "text-input";
          const metadata = prepareMetadata();
          const data = {
            source_id: sourceId,
            content_type: "default",
            text: analyzeText,
            keywords,
            metadata,
          };
          setLoadingMessage(`Analyzing manual text using ${searchType} search...`);
          const result = await submitAudit(data);
          result.searchType = searchType;
          allResults.push(result);
        }
      } else if (courseCode && selectedCourses.length === 0 && selectedPrograms.length === 0) {
        setLoadingMessage(`Fetching and analyzing course: ${courseCode} using ${searchType} search...`);
        const analyzeText = await fetchCourseText(courseCode);
        const metadata = prepareMetadata(courseCode);
        const data = {
          source_id: courseCode,
          content_type: "course",
          text: analyzeText,
          keywords,
          metadata,
        };
        const result = await submitAudit(data);
        result.searchType = searchType;
        allResults.push(result);

      } else if (selectedCourses.length > 0 && selectedPrograms.length === 0) {
        for (let i = 0; i < selectedCourses.length; i++) {
          const cCode = selectedCourses[i];
          setLoadingMessage(
            `Analyzing course ${cCode} (${i + 1}/${selectedCourses.length}) using ${searchType} search...`
          );

          const analyzeText = await fetchCourseText(cCode);
          const metadata = prepareMetadata(cCode);
          const data = {
            source_id: cCode,
            content_type: "course",
            text: analyzeText,
            keywords,
            metadata,
          };
          const result = await submitAudit(data);
          result.searchType = searchType; 
          allResults.push(result);
        }
      } else if (selectedPrograms.length > 0) {
        for (let i = 0; i < selectedPrograms.length; i++) {
          const programId = selectedPrograms[i];
          setLoadingMessage(
            `Analyzing program ${programId} (${i + 1}/${selectedPrograms.length}) using ${searchType} search...`
          );
          
          try {
            const detailsArray = await getProgramDetails(programId);
            
            if (detailsArray.length === 0) {
              console.error(`No details found for program ${programId}`);
              continue;
            }
            
            for (const version of detailsArray) {
              const versionId = `${programId}-v${version.version}`;
              setLoadingMessage(
                `Analyzing program ${programId} version ${version.version} (${i + 1}/${selectedPrograms.length}) using ${searchType} search...`
              );
              
              handleProgramContentFetched(version, versionId);
              
              const analyzeText = createProgramTextContent(version);
              
              const metadata = {
                programId: programId,
                programVersion: version.version,
                programTitle: version.displayName,
                programDescription: version.textDescription,
                programLevel: version.programLevelDescription,
                programCollege: version.collegeName,
                programDepartment: version.collegeDepartment,
                programExpirationDate: version.versionExpirationDate,
                programURL: `https://www.phoenix.edu/programs/${programId.toLowerCase().replace('/', '-')}.html`,
                searchType: searchType 
              };
              
              const data = {
                source_id: versionId,
                content_type: "program",
                text: analyzeText,
                keywords,
                metadata,
              };
              
              const result = await submitAudit(data);
              result.searchType = searchType; 
              allResults.push(result);
            }
          } catch (error) {
            console.error(`Error processing program ${programId}:`, error);
          }
        }      
      }

      localStorage.setItem('auditResults', JSON.stringify(allResults));
      localStorage.setItem('lastSearchType', searchType);

      allResults.forEach(result => {
        if (!result.searchType) {
          result.searchType = searchType;
        }
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setApiResult(allResults);
      
      const timestamp = new Date().getTime();
      const encodedSearchType = encodeURIComponent(searchType);
      window.location.href = `/results?timestamp=${timestamp}&searchType=${encodedSearchType}`;

    } catch (error) {
      console.error("Error in handleStartAudit:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="px-8 py-10">
      <Typography variant="h4" gutterBottom>
        Audit Your Learning Materials
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ mr: 1, mt: 3, mb: 2 }}>
          Keywords to identify
          <span style={{ color: "red" }}>*</span>
        </Typography>
      </Box>
      <TagInput label="" tags={keywords} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />

      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: "24px",
          color: "#3C3C3C",
          mt: 6,
        }}
      >
        Sources to analyze
        <span style={{ color: "red" }}>*</span>
      </Typography>

      <Box mt={2}>
        <TabSwitcherMUI activeTab={activeTab} onChangeTab={setActiveTab} />


        <SearchTypeSelector 
          value={searchType} 
          onChange={(type) => setSearchType(type)} 
        />

        <Box sx={{ minHeight: "200px", mb: 1, mt: 4 }}>
          {activeTab === "MANUAL" ? (
            <ManualInputView
              textValue={manualText}
              onTextChange={setManualText}
              metadataKey={metadataKey}
              onMetadataKeyChange={setMetadataKey}
              metadataValue={metadataValue}
              onMetadataValueChange={setMetadataValue}
              onCsvDataProcessed={handleCsvDataProcessed}
            />
          ) : (
            <Box>
              <AutoScanView
                selectedCourses={selectedCourses}
                onSelectCourse={handleCourseSelection}
                onCourseContentFetched={handleCourseContentFetched}
                selectedProgram={selectedProgramData?.code}
                onProgramSelect={handleProgramSelect}
                selectedPrograms={selectedPrograms}
                onProgramSelection={handleProgramSelection}
                onProgramContentFetched={handleProgramContentFetched}
              />
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="left"
          sx={{
            width: "100%",
            position: "relative",
            mt: 4,
          }}
        >
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleStartAudit}
              disabled={!isFormValid || loading}
              sx={{
                backgroundColor: "#0CBC8B",
                color: "#FFFFFF",
                width: "250px",
                borderRadius: "100px",
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                lineHeight: "34px",
                textTransform: "none",
                boxShadow: "0px 4px 10px rgba(12, 188, 139, 0.3)",
                "&:hover": {
                  backgroundColor: "#0aa87a",
                },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                  color: "#666666",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Start Audit"}
            </Button>
            
            <Tooltip title="View last scan results">
              <IconButton 
                onClick={() => navigate("/results")}
                sx={{ 
                  ml: 1,
                  color: "#0CBC8B",
                  '&:hover': {
                    backgroundColor: 'rgba(12, 188, 139, 0.08)',
                  }
                }}
              >
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {loadingMessage && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {loadingMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default AuditForm;
