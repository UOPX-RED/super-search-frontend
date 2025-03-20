import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import TabSwitcherMUI from "../TabSwitcher/tabswitcher";
import TagInput from "../TagInput/taginput";
import ManualInputView from "../ManualInputView/ManualInputView";
import AutoScanView from "../AutoScanView/AutoScanView";
import axios from "axios";
import ProgramSearch from "../ProgramSearch/ProgramSearch";
import { useCourseInfo } from "../../hooks/useCourseInfo";

import useSearchStore from "../../stores/useStore";

interface Program {
  code: string;
  title: string;
  collegeName: string;
  levelName: string;
  isActive: boolean;
}

const AuditForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"MANUAL" | "AUTO">("MANUAL");
  const { setApiResult } = useSearchStore.getState();
  const { getCourseDetails } = useCourseInfo();

  const [keywords, setKeywords] = useState<string[]>([]);

  const [manualText, setManualText] = useState("");
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseContents, setCourseContents] = useState<{[key: string]: string}>({});
  const [courseCode] = useState("");

  const [selectedProgramCode, setSelectedProgramCode] = useState<string | null>(null);
  const [selectedProgramData, setSelectedProgramData] = useState<Program | null>(null);

  const [loading, setLoading] = useState(false);

  const isFormValid = activeTab === "AUTO"
    ? (selectedCourses.length > 0 || courseCode) && keywords.length > 0
    : activeTab === "MANUAL"
        ? manualText.trim() !== "" && keywords.length > 0
      : selectedCourses.length > 0 && keywords.length > 0;

  const handleAddTag = (tag: string) => {
    setKeywords((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tag: string) => {
    setKeywords((prev) => prev.filter((item) => item !== tag));
  };

  const handleCourseSelection = (courseCode: string) => {
    setSelectedCourses(prevSelected => {
      if (prevSelected.includes(courseCode)) {
        return prevSelected.filter(code => code !== courseCode);
      } else {
        return [...prevSelected, courseCode];
      }
    });
  };

  const handleCourseContentFetched = (content: string, courseCode: string) => {
    setCourseContents(prev => ({
      ...prev,
      [courseCode]: content
    }));
    
    console.log(`Stored content for ${courseCode}, total courses with content: ${Object.keys({...courseContents, [courseCode]: content}).length}`);
  };

  const handleProgramSelect = (programData: Program | null) => {
    setSelectedProgramCode(programData?.code || null);
    setSelectedProgramData(programData);
  };

  const submitAudit = async (data: unknown) => {
    if (!isFormValid) return;
    setLoading(true);
    
    const token = localStorage.getItem("userToken");
    if (token) {
      axios.defaults.headers.common["X-Azure-Token"] = token;
    }
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post("http://localhost:8000/analyze", data);
      console.log("Audit submitted successfully", response.data);

      setApiResult(response.data);

      setTimeout(() => {
        window.location.href = `/results/${response.data.id}`;
      }, 1000);
    } catch (error) {
      console.error("Error submitting audit", error);
      setLoading(false);
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
      <TagInput
        label=""
        tags={keywords}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

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

        <Box sx={{ minHeight: "200px", mb: 1 }}>
          {activeTab === "MANUAL" ? (
            <ManualInputView
              textValue={manualText}
              onTextChange={setManualText}
              metadataKey={metadataKey}
              onMetadataKeyChange={setMetadataKey}
              metadataValue={metadataValue}
              onMetadataValueChange={setMetadataValue}
            />
          ) : (
            <Box>
              <AutoScanView
                selectedCourses={selectedCourses}
                onSelectCourse={handleCourseSelection}
                onCourseContentFetched={handleCourseContentFetched}
              />
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          justifyContent="left"
          sx={{
            width: "100%",
            position: "relative",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            onClick={async () => {
              let courseURL = "";
              let analyzeText = "";
              let sourceId = "";

              if (activeTab === "MANUAL") {
                analyzeText = manualText;
                sourceId = "text-input";
              } else if (courseCode) {
                try {
                  analyzeText = await getCourseDetails(courseCode);
                  sourceId = courseCode;
                  const [prefix, number] = courseCode.split("/");
                  courseURL = `https://www.phoenix.edu/online-courses/${prefix}${number}.html`;
                } catch (error) {
                  console.error(`Error fetching course ${courseCode}:`, error);
                  return;
                }
              } else if (selectedCourses.length > 0) {
                try {
                  const coursesContent = await Promise.all(
                    selectedCourses.map(async (code) => {
                      if (courseContents[code]) {
                        return courseContents[code];
                      }

                      try {
                        return await getCourseDetails(code);
                      } catch (error) {
                        console.error(`Error fetching course ${code}:`, error);
                        return `Course: ${code} (details could not be loaded)`;
                      }
                    })
                  );
                  
                  analyzeText = coursesContent.join("\n\n");
                  sourceId = selectedCourses.join(",");
                  
                  if (selectedCourses[0]) {
                    const [prefix, number] = selectedCourses[0].split("/");
                    courseURL = `https://www.phoenix.edu/online-courses/${prefix}${number}.html`;
                  }
                } catch (error) {
                  console.error("Error preparing course content:", error);
                  return; 
                }
              }

              interface MetadataObject {
                [key: string]: string | string[];
              }

              let metadata: MetadataObject = { 
                [metadataKey.trim() || "programId"]: metadataValue.trim() || "FIN-PM-001" 
              };
              
              const metadataElement = document.getElementById("allMetadata") as HTMLInputElement;
              if (metadataElement && metadataElement.value) {
                try {
                  const parsedMetadata = JSON.parse(metadataElement.value);
                  if (Object.keys(parsedMetadata).length > 0) {
                    metadata = parsedMetadata;
                  }
                } catch (e) {
                  console.error("Error parsing metadata:", e);
                }
              }

              if (courseCode) {
                metadata = {
                  ...metadata,
                  courseCode: courseCode,
                  ...(courseURL && { courseLink: courseURL })
                };
              } else if (selectedCourses.length > 0) {
                metadata = {
                  ...metadata,
                  courseCodes: selectedCourses, 
                  ...(courseURL && { courseLink: courseURL })
                };
              }

              if (selectedProgramData) {
                metadata = {
                  ...metadata,
                  programCode: selectedProgramData.code,
                  programTitle: selectedProgramData.title,
                  programLevel: selectedProgramData.levelName,
                  programCollege: selectedProgramData.collegeName
                };
              }
              
              submitAudit({
                source_id: sourceId,
                content_type: activeTab === "AUTO" ? "course" : "default",
                text: analyzeText,
                keywords,
                metadata
              });
            }}
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
        </Box>
      </Box>
    </div>
  );
};

export default AuditForm;
