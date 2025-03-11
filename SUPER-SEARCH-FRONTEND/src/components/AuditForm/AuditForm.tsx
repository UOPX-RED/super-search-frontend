import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TabSwitcherMUI from "../TabSwitcher/tabswitcher";
import TagInput from "../TagInput/taginput";
import ManualInputView from "../ManualInputView/ManualInputView";
import AutoScanView from "../AutoScanView/AutoScanView";
import axios from "axios";

const DUMMY_COURSES = ["CJS/221", "CPSS/332", "HEA/731", "SWRK/350"];

const AuditForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"MANUAL" | "AUTO">("MANUAL");

  const [keywords, setKeywords] = useState<string[]>([]);

  const [manualText, setManualText] = useState("");
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

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

  const handleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === DUMMY_COURSES.length ? [] : [...DUMMY_COURSES]
    );
  };

  const submitAudit = async (data: unknown) => {
    console.log(data);
    try {
      const response = await axios.post("http://localhost:8000/analyze", data);
      console.log(response.data);
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

      <TagInput
        label="Keywords to identify"
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
              onSelectCourse={handleSelectCourse}
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
            onClick={() =>
              submitAudit({
                source_id: "123",
                content_type: "program",
                text: manualText,
                keywords,
                metadata: {
                  [metadataKey]: metadataValue,
                },
              })
            }
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
