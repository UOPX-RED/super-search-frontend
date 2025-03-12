import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TabSwitcherMUI from "../TabSwitcher/tabswitcher";
import TagInput from "../TagInput/taginput";
import ManualInputView from "../ManualInputView/ManualInputView";
import AutoScanView from "../AutoScanView/AutoScanView";
import axios from "axios";

import useSearchStore from "../../stores/useStore";

const DUMMY_COURSES = ["CJS/221", "CPSS/332", "HEA/731", "SWRK/350"];

const AuditForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"MANUAL" | "AUTO">("MANUAL");
  const { setApiResult } = useSearchStore.getState();

  const [keywords, setKeywords] = useState<string[]>([]);

  const [manualText, setManualText] = useState("");
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseCode, setCourseCode] = useState("");
  const [courseText, setCourseText] = useState("");

  const isFormValid = activeTab === "AUTO"
    ? courseCode && keywords.length > 0
    : activeTab === "MANUAL"
        ? manualText.trim() !== "" && keywords.length > 0
        : selectedCourses.length > 0 && keywords.length > 0;

  const handleAddTag = (tag: string) => {
    setKeywords((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tag: string) => {
    setKeywords((prev) => prev.filter((item) => item !== tag));
  };

  const handleSelectCourse = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleCourseCode = (course: string) => {
    setCourseCode(course)
    // fetch course information here and set it?
    // courseResp = getCourseInfo(courseCode);
    // setCourseText(courseResp)
  };


  const handleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === DUMMY_COURSES.length ? [] : [...DUMMY_COURSES]
    );
  };

  const submitAudit = async (data: unknown) => {
    if (!isFormValid) return;
    
    const token = localStorage.getItem("userToken");
    if (token) {
      axios.defaults.headers.common["X-Azure-Token"] = token;
    }
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${BACKEND_URL}/api/analyze`, data);
      console.log("Audit submitted successfully", response.data);

      // upload results to zustand store
      setApiResult(response.data);

      setTimeout(() => {
        window.location.href = `/results/${response.data.id}`;
      }, 1000);
    } catch (error) {
      console.error("Error submitting audit", error);
    }
  };

  return (
    // <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 3 }}>
    <div className="px-8 py-10">
      <Typography variant="h4" gutterBottom>
        Audit Your Learning Materials
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
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
            <AutoScanView
              courses={DUMMY_COURSES}
              selectedCourses={selectedCourses}
              // onSelectCourse={handleSelectCourse}
              onSelectCourse={handleCourseCode}
              onSelectAll={handleSelectAll}
            />
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
            onClick={() => {
              const finalMetadataKey = metadataKey.trim() || "programId";
              const finalMetadataValue = metadataValue.trim() || "FIN-PM-001";
              
              // check if it's a program/course when setting this
              submitAudit({
                source_id: "123",
                content_type: "program",
                text: manualText,
                keywords,
                metadata: {
                  [finalMetadataKey]: finalMetadataValue,
                },
              })
            }}
            disabled={!isFormValid}
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
            Start Audit
          </Button>
        </Box>
      </Box>
    </div>
    // </Box>
  );
};

export default AuditForm;
