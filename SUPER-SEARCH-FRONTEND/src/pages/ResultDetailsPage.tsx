import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Stack, Chip, Container } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import HighlightedSectionCard from "../components/HighlightedSectionCard/HighlightedSectionCard";
import useSearchStore from "../stores/useStore";

const ResultDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { apiResult } = useSearchStore.getState();

  if (!apiResult) {
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
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const handleBack = () => {
    navigate("/");
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
                {/* @ts-ignore */}
                Request: {apiResult.metadata.courseCode ? apiResult.metadata.courseCode : apiResult.request_id}
              </Typography>
              {apiResult.keywords_matched.length > 0 && (
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
              Highlighted Sections ({apiResult?.highlighted_sections.length})
            </Typography>
          </Box>
          
          {/* @ts-ignore */}
          {apiResult.metadata.courseLink && <Box
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
              {/* @ts-ignore */}
              <a href={apiResult.metadata.courseLink} target="_blank" rel="noopener noreferrer">
                {/* @ts-ignore */}
                {apiResult.metadata.courseLink}
              </a>
            </Box>
          </Box>}

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
                  Keywords matched ({apiResult.keywords_matched.length})
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap">
                  {apiResult.keywords_matched.map((kw) => (
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
                  {apiResult.original_text}
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
                  {apiResult.content_type !== "default" && <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Content type:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {apiResult.content_type}
                    </Typography>
                  </Box>}
                  {/* @ts-ignore */}
                  {apiResult.metadata.author && <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Author:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {/* @ts-ignore */}
                      {apiResult.metadata.author}
                    </Typography>
                  </Box>}
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Created On:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {apiResult.created_at}
                    </Typography>
                  </Box>
                  {/* @ts-ignore */}
                  {apiResult.metadata.collegeDepartment && <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      display="inline"
                    >
                      Department:
                    </Typography>{" "}
                    <Typography variant="body2" display="inline">
                      {/* @ts-ignore */}
                      {apiResult.metadata.collegeDepartment}
                    </Typography>
                  </Box>}
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
                {apiResult.highlighted_sections.map((section, idx) => (
                  <HighlightedSectionCard
                    key={idx}
                    matchedWord={apiResult.keywords_matched}
                    confidence={section.confidence}
                    matchedText={section.matched_text}
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
