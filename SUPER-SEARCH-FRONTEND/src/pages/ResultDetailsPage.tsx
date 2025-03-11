import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper, Typography, Stack, Chip, Container } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import HighlightedSectionCard from "../components/HighlightedSectionCard/HighlightedSectionCard";
import useSearchStore from "../stores/useStore";

const mockDetailDataItems = {
  "course-123": {
    id: "course-123",
    type: "course",
    title: "CJS/221: Introduction to Criminal Justice",
    matchedKeywords: ["Diversity", "Equity"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
    originalText: `This course provides an introduction to the criminal justice system, with particular emphasis on understanding diverse perspectives and equitable approaches to law enforcement. Students will examine how social factors influence criminal behavior and the justice system's response.`,
    additionalInfo: {
      contentType: "course",
      author: "Prof. James Wilson",
      createdOn: "09/01/2023",
      department: "Criminal Justice",
    },
    highlightedSections: [
      {
        matchedWord: "Diversity",
        confidence: "89%",
        matchedText: `Students will examine how social factors influence criminal behavior and the justice system's response.`,
        reason: `This section acknowledges how different social factors affect the criminal justice system, recognizing the diversity of experiences and perspectives.`,
      },
      {
        matchedWord: "Equity",
        confidence: "92%",
        matchedText: `This course emphasizes understanding equitable approaches to law enforcement.`,
        reason: `The text directly addresses equity in the context of law enforcement approaches, highlighting the importance of fair treatment.`,
      },
    ],
  },
  "policy-789": {
    id: "policy-789",
    type: "policy",
    title: "Grievance Policy Document",
    matchedKeywords: ["DEI"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
    originalText: `Our university is committed to creating opportunities for all students, regardless of their background. We have implemented several programs to ensure equal access to resources and support services for traditionally underserved populations. Our goal is to build a community where everyone feels welcome and valued, and where diverse perspectives enhance the learning experience for all.`,
    additionalInfo: {
      contentType: "policy",
      author: "University Administration",
      createdOn: "05/15/2023",
      department: "Office of Student Affairs",
    },
    highlightedSections: [
      {
        matchedWord: "DEI",
        confidence: "95%",
        matchedText: `Our university is committed to creating opportunities for all students, regardless of their background.`,
        reason: `This statement encompasses the core principles of Diversity, Equity, and Inclusion by committing to support students of all backgrounds.`,
      },
    ],
  },
};

const defaultMockData = {
  id: "policy-doc-123",
  type: "policy",
  title: "Policy-doc-123",
  matchedKeywords: ["Equity", "Inclusion", "Diversity"],
  allKeywords: ["Equity", "Inclusion", "Diversity", "DEI"],
  originalText: `Our university is committed to creating opportunities for all students, regardless of their background. We have implemented several programs to ensure equal access to resources and support services for traditionally underserved populations. Our goal is to build a community where everyone feels welcome and valued, and where diverse perspectives enhance the learning experience for all.`,
  additionalInfo: {
    contentType: "policy",
    author: "University Administration",
    createdOn: "05/15/2023",
    department: "Office of Student Affairs",
  },
  highlightedSections: [
    {
      matchedWord: "Equity",
      confidence: "92%",
      matchedText: `We have implemented several programs to ensure equal access to resources for all students...`,
      reason: `This text specifically addresses the concept of providing equal access to resources for underserved populations, which is a core element of equity.`,
    },
    {
      matchedWord: "Inclusion",
      confidence: "85%",
      matchedText: `Our goal is to build a community where everyone feels welcome and valued...`,
      reason: `This section directly addresses inclusion by discussing creating a welcoming environment for all.`,
    },
  ],
};

const ResultDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const detailData =
    id && id in mockDetailDataItems
      ? mockDetailDataItems[id as keyof typeof mockDetailDataItems]
      : defaultMockData;

  const {
    title,
    matchedKeywords,
    originalText,
    additionalInfo,
    highlightedSections,
  } = detailData;

  const { apiResult } = useSearchStore.getState();
  console.log("API Result:", apiResult);

  const handleBack = () => {
    navigate("/results");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#367CFF",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
                textDecoration: "none",
              }}
              onClick={handleBack}
            >
              back
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "flex-start" },
              mb: 1,
              gap: 11,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "24px",
                  color: "#3C3C3C",
                  mb: 3,
                }}
              >
                {title}
              </Typography>
              {matchedKeywords.length > 0 && (
                <ErrorIcon sx={{ color: "#B3261E", mb: 3 }} />
              )}
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: "16px",
                color: "#3C3C3C",
              }}
            >
              Highlighted Sections ({highlightedSections.length})
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box mb={2}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#3C3C3C",
                    mb: 1,
                  }}
                >
                  Keywords matched ({matchedKeywords.length})
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap">
                  {matchedKeywords.map((kw) => (
                    <Chip
                      key={`matched-${kw}`}
                      label={kw}
                      sx={{
                        backgroundColor: "#DB3725",
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontSize: "14px",
                        height: "28px",
                        borderRadius: "14px",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#3C3C3C",
                    mb: 1,
                  }}
                >
                  Original Text
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    color: "#919090",
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {originalText}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#3C3C3C",
                    mb: 1,
                  }}
                >
                  Additional Info
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Content type:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {additionalInfo.contentType}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Author:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {additionalInfo.author}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Created On:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {additionalInfo.createdOn}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Department:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {additionalInfo.department}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: { xs: "100%", md: "350px" },
              }}
            >
              <Stack spacing={2}>
                {highlightedSections.map((section, idx) => (
                  <HighlightedSectionCard
                    key={idx}
                    matchedWord={section.matchedWord}
                    confidence={section.confidence}
                    matchedText={section.matchedText}
                    reason={section.reason}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResultDetailsPage;
