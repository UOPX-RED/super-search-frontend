import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import TabSwitcherMUI from "../TabSwitcher/tabswitcher";
import TagInput from "../TagInput/taginput";
import ManualInputView from "../ManualInputView/ManualInputView";
import AutoScanView from "../AutoScanView/AutoScanView";
import axios from "axios";

import useSearchStore from "../../stores/useStore";

type Course = {
  title: string;
  description: string;
  topics: {
    id: string;
    name: string;
    objectives?: {
      id: string;
      title: string;
    }[];
  }[];
};

type Courses = {
  [key: string]: Course;
};

const DUMMY_COURSES : Courses = {
  "SWRK/399": {
      "title": "Research and Evaluation in Social Work Practice",
      "description": "Students will learn ethical, culturally informed, anti-racist, and anti-oppressive approaches to critically evaluate research to inform decision-making in their practice and articulate how their practice experience informs research and evaluation decisions. The course will include ways to analyze inherent bias in current literature and research. Students will learn to articulate and share research findings in ways that are usable to a variety of clients and constituencies.",
      "topics": [
          {
              "id": "648272a7-398f-48aa-8811-5bf19d6003f5",
              "name": "Evidence-Based Social Work Research Process and Ethics"
        }
      ]
  },
  "MTH/213": {
    "title": "Mathematics for Elementary Educators I",
    "description": "This is the first course of a two-part series designed for K-8 pre-service teachers to address the conceptual understanding of mathematics taught in elementary school. The focus of part one will be on real number properties, patterns, operations and algebraic reasoning, and problem solving.",
    "topics": [
        {
            "id": "82a3cab7-c1b7-41ae-b357-6592cad0c84d",
            "name": "Introduction to Standards and Problem Solving",
            "objectives": [
                {
                    "id": "166b0610-def5-40a4-933f-86724e8b66af",
                    "title": "Explain the six principles and process standards of elementary school mathematics as defined by the National Council of Teachers of Mathematics."
                },
                {
                    "id": "3c3adedd-2de4-41db-aadb-5e3fe1a4a513",
                    "title": "Explain the standards progression for your state's mathematics standards."
                },
                {
                    "id": "d5ae9b4e-7f21-4d50-8a8e-db6b6f330641",
                    "title": "Apply problem solving strategies."
                },
                {
                    "id": "dda6923f-6163-4a0b-86c2-c2a92c0e7fcc",
                    "title": "Use Venn diagrams to solve problems."
                },
                {
                    "id": "c266b278-3f0c-46e9-a765-010f29a0cf87",
                    "title": "Analyze teaching techniques and manipulative use for teaching problem solving."
                }
            ]
        },
        {
            "id": "b15ba23f-4fbd-4103-aaf4-85a6a9db7e67",
            "name": "Whole Number Operations and Number Theory",
            "objectives": [
                {
                    "id": "3fe2f78e-8d19-4c1e-8f0c-2462c5b78736",
                    "title": "Research different numeration systems. "
                },
                {
                    "id": "46bee31d-75c9-4d41-b3ad-e03f52539bcd",
                    "title": "Make reasonable estimates."
                },
                {
                    "id": "bfae33c3-75e1-4dd4-b059-0a736849b566",
                    "title": "Apply algorithms for operations of whole numbers. "
                },
                {
                    "id": "ef99cad7-e39b-4a15-8aab-846d71353f32",
                    "title": "Apply number theory to solve problems."
                },
                {
                    "id": "de477dd5-7338-4cce-a1d7-6af554294c8f",
                    "title": "Analyze teaching techniques and manipulative use for teaching whole number properties."
                }
            ]
        },
        {
            "id": "278dc28d-500e-461e-ae86-803db55342b0",
            "name": "Integers and Rational Numbers",
            "objectives": [
                {
                    "id": "61ddc15b-1e33-4fee-8472-d71aad44ce38",
                    "title": "Apply the properties of integers."
                },
                {
                    "id": "362f17cc-37ea-4574-bbe3-7ca96e02dd80",
                    "title": "Solve problems involving rational numbers."
                },
                {
                    "id": "b18ea12a-3826-4948-9800-db93c0b1fec6",
                    "title": "Apply rational number knowledge to solve proportions."
                },
                {
                    "id": "8d7fe9b6-131c-488b-8f82-ad99b3ce110b",
                    "title": "Analyze teaching techniques and manipulative use for teaching rational number properties."
                }
            ]
        },
        {
            "id": "b8b186a3-f581-4434-a585-34df28542804",
            "name": "Real Numbers and Algebraic Thinking",
            "objectives": [
                {
                    "id": "a21e9319-0add-4a29-9a63-f8b46112992d",
                    "title": "Solve decimal, percent, and real number problems."
                },
                {
                    "id": "0847dabd-7a4c-487a-bcfe-5fbc05ce3fd3",
                    "title": "Solve simple equations, inequalities, and functions."
                },
                {
                    "id": "48630e78-da52-4013-ac84-d68cb913759d",
                    "title": "Solve problems in the Cartesian coordinate system. "
                },
                {
                    "id": "a70e1b68-c36b-4f58-9482-1d3ff99aee0d",
                    "title": "Analyze teaching techniques and manipulative use for teaching real numbers and equations."
                }
            ]
        },
        {
            "id": "a4da19ea-5ec9-48be-99fd-4de195564c0a",
            "name": "Mathematical Connections",
            "objectives": [
                {
                    "id": "698e76af-ad6b-44d7-bc75-f0c711bc832b",
                    "title": "Identify patterns in elementary mathematics. "
                },
                {
                    "id": "fc71a340-60ed-48e6-ab01-d0a6489c606e",
                    "title": "Synthesize the elementary mathematics concepts addressed in this course."
                },
                {
                    "id": "d757106f-c36d-4901-97aa-c72f434047fd",
                    "title": "Explain how a conceptual understanding of mathematics has been addressed in this class."
                }
            ]
        }
    ]
  },
  "MGT/498": {
    "title": "Strategic Management",
    "description": "This course gives students the opportunity to integrate management concepts and practices to contemporary business strategies, while discussing the theories of strategic management. This course will focus on improving management decision-making and problem-solving skills. Students will create a strategic management plan. Special emphasis is placed on business ethics, sustainability, innovation, and the legal environment of business.",
    "topics": [
        {
            "id": "4de43a5b-a5c7-4ac4-850a-325ad1208565",
            "name": "Strategic Planning and Strategic Management - The Fundamentals",
            "objectives": [
                {
                    "id": "e2cbb83f-749a-49d7-bd0f-e715211bf4f7",
                    "title": "Indicate the differences between strategic planning and strategic management."
                },
                {
                    "id": "9cf41d25-46fc-4888-98c7-bb5e13868d52",
                    "title": "Describe the components of an internal analysis leading to strategic planning."
                },
                {
                    "id": "6dd20ef8-df51-47cf-934e-ceff1977369a",
                    "title": "Describe the components of an external analysis leading to strategic planning."
                },
                {
                    "id": "1b4b9314-0ccd-41a9-a654-4b01c3669e9e",
                    "title": "Discuss how to categorize different industries.  "
                }
            ]
        },
        {
            "id": "eea7aeab-134d-4aa4-9ba6-8990452842cc",
            "name": "Building a Competitive Advantage - Limitations and Opportunities",
            "objectives": [
                {
                    "id": "25016e38-5d5a-4fd3-af31-ba019df9b364",
                    "title": "Explain the influence of ethics, social responsibility, and legal considerations on strategic planning."
                },
                {
                    "id": "8dbdb784-4916-48ba-97d8-b2d28e9b9aec",
                    "title": "Examine competitive strategies."
                },
                {
                    "id": "531bc8b7-83ed-4709-b14b-cc843dd7b277",
                    "title": "Appraise costing and financial strategies."
                },
                {
                    "id": "4975c08a-73fe-4c90-8556-92388f77b2b6",
                    "title": "Outline value chain strategies.  "
                }
            ]
        },
        {
            "id": "476b4c65-bdfb-4ea0-97c1-ebc09fd76db0",
            "name": "Tactical Implementation and Metrics",
            "objectives": [
                {
                    "id": "c6b524d7-a9cc-4b76-8245-dfaab03c46d8",
                    "title": "Examine growth strategies and strategic implementation."
                },
                {
                    "id": "f1804b37-48fb-4f0f-9fe4-a8038f903872",
                    "title": "Explain how organizational structure influences implementation."
                },
                {
                    "id": "633e2a25-442d-44bc-90eb-57e39fe68277",
                    "title": "Describe cultural, structural, and leadership considerations that must be incorporated into strategy implementation."
                },
                {
                    "id": "ce786718-1b20-4856-a7aa-2c3d2d301a84",
                    "title": "Examine metrics to measure implementation performance."
                }
            ]
        },
        {
            "id": "86788d68-78ff-4382-82aa-b9e2bc808c46",
            "name": "Innovation, Sustainability, and the Global Market",
            "objectives": [
                {
                    "id": "d9674cd1-bc4a-49b8-9b1e-2af84b546914",
                    "title": "Assess the advantages and disadvantages of globalization and the impact on the strategic management plan.  "
                },
                {
                    "id": "d41997c6-8b03-4174-b2cd-db68c7f8c39e",
                    "title": "Construct a long-term strategic management plan for sustaining organizational performance via strategic alliances."
                },
                {
                    "id": "4626f454-2026-4639-acb8-bf89b0d7f201",
                    "title": "Compare innovation strategies to sustain long-term strategic growth."
                }
            ]
        },
        {
            "id": "b6825a64-67c2-4fae-a533-30318b980492",
            "name": "Strategic Plan Evaluation, Control, and Feedback",
            "objectives": [
                {
                    "id": "c22accb3-210e-474a-99ad-0144dd13bd32",
                    "title": "Evaluate the appropriate controls, performance measures, and feedback systems to use for various business scenarios."
                },
                {
                    "id": "e3cf19dd-19dd-4d69-8496-4694ac53244d",
                    "title": "Examine product diversification."
                },
                {
                    "id": "95fcbe57-e869-4927-a6a7-dbeeabb05a43",
                    "title": "Investigate key performance indicators."
                },
                {
                    "id": "a41dde40-f5b1-46a0-8a58-c853e05e6e0e",
                    "title": "Evaluate company strategy and social value."
                }
            ]
        }
    ]
  },
  "ENV/420": {
    "title": "Environmental Risk Assessment",
    "description": "This course provides an overview of the basic concepts of human and ecological risk assessment. Students evaluate various components of risk assessment, including human health, environmental, occupational, ecological, and risk management. Significant case studies are used to illustrate the assessment process.",
    "topics": [
        {
            "id": "2763fc0d-5cc5-42e8-87cf-e4ac4ba77def",
            "name": "Overview of Risk Assessment",
            "objectives": [
                {
                    "id": "3308d70b-ab0c-4d53-881c-4ff27eced743",
                    "title": "Summarize the historical development of the human and ecological risk assessment process."
                },
                {
                    "id": "6beaf037-f42d-48bb-a049-f4e023ea93f2",
                    "title": "Describe the ecological risk assessment framework."
                }
            ]
        },
        {
            "id": "efe450e2-1e18-43d2-ae26-ea25cc360215",
            "name": "Environmental Elements Risk Assessment",
            "objectives": [
                {
                    "id": "15894afc-4a18-41cb-aa63-f6634d9f5e6e",
                    "title": "Describe the four steps of environmental risk assessment."
                },
                {
                    "id": "6c2dcec0-0a72-4f0f-83f6-1e49cabbceb7",
                    "title": "Evaluate the application of environmental risk analysis."
                }
            ]
        },
        {
            "id": "8b8def41-2910-43bb-83aa-6e0bdf103692",
            "name": "Occupational Risk Assessment",
            "objectives": [
                {
                    "id": "69319463-74f1-4937-9250-355eeee428aa",
                    "title": "Examine the application of risk assessment in occupational environments."
                },
                {
                    "id": "31bae9e1-91c4-4a3e-a4da-d3ee9427fb6d",
                    "title": "Differentiate the application of risk assessment in occupational and non-occupational environments."
                }
            ]
        },
        {
            "id": "51a4a38c-9899-4e76-8b4b-37f0aa979b7c",
            "name": "Ecology and Wildlife Risk Assessment",
            "objectives": [
                {
                    "id": "afd89a56-54cd-4775-821b-d8326e8adbe4",
                    "title": "Evaluate the ecological and societal value of natural ecosystems."
                },
                {
                    "id": "15d06dc9-c651-451f-85cf-3757bcfca5de",
                    "title": "Analyze the use of probabilistic assessment methods in predicting ecological risks for environmental contaminants."
                }
            ]
        },
        {
            "id": "53b8fe21-d856-4dc2-a733-5a2098429ba3",
            "name": "Risk Management",
            "objectives": [
                {
                    "id": "cfdea701-6a90-4070-93eb-682c2df87214",
                    "title": "Analyze long-term costs and benefits to make decisions based on the economic and social effects of environmental issues."
                },
                {
                    "id": "569fc0d2-60cb-41fd-9424-5a073b8b8458",
                    "title": "Devise appropriate courses of action based on environmental risk assessments."
                }
            ]
        }
    ]
  }
};

const AuditForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"MANUAL" | "AUTO">("MANUAL");
  const { setApiResult } = useSearchStore.getState();

  const [keywords, setKeywords] = useState<string[]>([]);

  const [manualText, setManualText] = useState("");
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");

  // const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const selectedCourses: string[] = [];
  const [courseCode, setCourseCode] = useState("");

  const [loading, setLoading] = useState(false);

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

  // const handleSelectCourse = (course: string) => {
  //   setSelectedCourses((prev) =>
  //     prev.includes(course)
  //       ? prev.filter((c) => c !== course)
  //       : [...prev, course]
  //   );
  // };

  const handleCourseCode = (course: string) => {
    setCourseCode(course)
  };


  // const handleSelectAll = () => {
  //   setSelectedCourses(
  //     []
  //     // selectedCourses.length === DUMMY_COURSES.length ? [] : [...DUMMY_COURSES]
  //   );
  // };

  const getCourseInfo = (courseCode: string) => {
    const course = DUMMY_COURSES[courseCode]
    const courseString = `${course.title} - ${course.description} Topics: ${course.topics.map(topic => `${topic.name}${topic.objectives ? ` Objectives: ${topic.objectives.map(obj => obj.title).join(', ')}` : ''}`).join(', ')}`;
    console.log(courseString);
    return courseString;
  }

  const submitAudit = async (data: unknown) => {
    if (!isFormValid) return;
    setLoading(true);
    
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
      setLoading(false);
    }
  };

  return (
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
              // onSelectAll={handleSelectAll}
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
              let courseURL = "";

              const analyzeText = manualText 
                  ? manualText 
                  : courseCode 
                      ? getCourseInfo(courseCode) 
                  : "";
              let metadata = { [metadataKey.trim() || "programId"]: metadataValue.trim() || "FIN-PM-001" };
              
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

              metadata = {
                ...metadata,
                ...(courseCode && { courseCode: courseCode }),
                ...(courseURL && courseCode && { courseLink: courseURL })
              };
              
              if (courseCode) {
                const [prefix, number] = courseCode.split("/");
                courseURL = `https://www.phoenix.edu/online-courses/${prefix}${number}.html`;
              } 
              
              // check if it's a program/course when setting this
              submitAudit({
                source_id: activeTab === "MANUAL" ? "text-input" : courseCode, // only two choices for now
                content_type: courseCode ? "course" : "default",
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
