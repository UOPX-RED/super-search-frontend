/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper, Typography, Stack, Chip, Container } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import HighlightedSectionCard from "../components/HighlightedSectionCard/HighlightedSectionCard";
import useSearchStore from "../stores/useStore";
import "../styles/highlight.css";

const ResultDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiResult } = useSearchStore.getState();

  const resultsArray = Array.isArray(apiResult) ? apiResult : [apiResult];
  const result = resultsArray.find((item) => item.id === id);
  if (!result) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">No details found for ID: {id}</Typography>
      </Box>
    );
  }

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
              Back
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
                {result.metadata?.courseCode
                  ? result.metadata.courseCode
                  : result.request_id}
              </Typography>
              {result.keywords_matched?.length > 0 && (
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
              Highlighted Sections ({result?.highlighted_sections?.length || 0})
            </Typography>
          </Box>
          
          {result.metadata?.courseLink && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 1,
                paddingBottom: 2,
              }}
            >
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
                Course URL
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <a
                  href={result.metadata.courseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.metadata.courseLink}
                </a>
              </Box>
            </Box>
          )}

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
                  Keywords matched ({result.keywords_matched?.length || 0})
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap">
                  {(result.keywords_matched || []).map((kw: string) => (
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

              <Box sx={{ mt: 5 }} id="original-text-container">
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
                  {result.original_text}
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
                  {result.content_type !== "default" && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={600} display="inline">
                        Content type:
                      </Typography>{" "}
                      <Typography variant="body2" display="inline">
                        {result.content_type}
                      </Typography>
                    </Box>
                  )}
                  {result.metadata?.author && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={600} display="inline">
                        Author:
                      </Typography>{" "}
                      <Typography variant="body2" display="inline">
                        {result.metadata.author}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Created On:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {result.created_at}
                    </Typography>
                  </Box>
                  {result.metadata?.collegeDepartment && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={600} display="inline">
                        Department:
                      </Typography>{" "}
                      <Typography variant="body2" display="inline">
                        {result.metadata.collegeDepartment}
                      </Typography>
                    </Box>
                  )}

                  {result.content_type === "program" && (
                    <>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} display="inline">
                          Program ID:
                        </Typography>{" "}
                        <Typography variant="body2" display="inline">
                          {result.metadata?.programId || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} display="inline">
                          Version:
                        </Typography>{" "}
                        <Typography variant="body2" display="inline">
                          {result.metadata?.programVersion || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} display="inline">
                          Program Title:
                        </Typography>{" "}
                        <Typography variant="body2" display="inline">
                          {result.metadata?.programTitle || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} display="inline">
                          College:
                        </Typography>{" "}
                        <Typography variant="body2" display="inline">
                          {result.metadata?.programCollege || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} display="inline">
                          Department:
                        </Typography>{" "}
                        <Typography variant="body2" display="inline">
                          {result.metadata?.programDepartment || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} display="inline">
                          Level:
                        </Typography>{" "}
                        <Typography variant="body2" display="inline">
                          {result.metadata?.programLevel || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                      </Box>
                    </>
                  )}
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
                {(result.highlighted_sections || []).map((section: any, idx: number) => (
                  <HighlightedSectionCard
                    key={idx}
                    matchedWord={result.keywords_matched}
                    confidence={section.confidence}
                    matchedText={section.matched_text}
                    reason={section.reason}
                    start_index={section.start_index}
                    end_index={section.end_index}
                    conceptMatched={section.concept_matched}
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
