import React from "react";
import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import ResultCard from "../components/ResultCard/ResultCard";
import KeywordsMatchedHeader from "../components/KeywordsMatchedHeader/KeywordsMatchedHeader";

const mockResults = [
  {
    id: "course-123",
    type: "course",
    title: "CJS/221: Introduction to Criminal Justice",
    matchedKeywords: ["Diversity", "Equity"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
  },
  {
    id: "course-456",
    type: "course",
    title: "CPSS/332: Intro to Cognitive Psychology",
    matchedKeywords: ["Inclusion"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
  },
  {
    id: "policy-789",
    type: "policy",
    title: "Grievance Policy Document",
    matchedKeywords: ["DEI"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
  },
  {
    id: "course-101",
    type: "course",
    title: "HEA/731: Health Education for Diverse Communities",
    matchedKeywords: ["Diversity", "Inclusion"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
  },
  {
    id: "policy-202",
    type: "policy",
    title: "Student Accommodation Guidelines",
    matchedKeywords: ["Equity"],
    allKeywords: ["Diversity", "Equity", "Inclusion", "DEI"],
  },
];

const getAllMatchedKeywords = () => {
  const allMatched = new Set<string>();
  mockResults.forEach((result) => {
    result.matchedKeywords.forEach((keyword) => {
      allMatched.add(keyword);
    });
  });
  return Array.from(allMatched);
};

const getAllKeywords = () => {
  if (mockResults.length === 0) return [];
  return mockResults[0].allKeywords;
};

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const matchedKeywords = getAllMatchedKeywords();
  const allKeywords = getAllKeywords();

  const handleViewDetails = (id: string) => {
    navigate(`/results/${id}`);
  };

  const handleNewAudit = () => {
    navigate("/");
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        my: 15,
        p: 10, 
        borderRadius: 5,
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        border: '2px solid #e0e0e0',
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "28px",
            color: "#3C3C3C",
          }}
        >
          Your Audit Results
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewAudit}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            textTransform: "none",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            px: 2,
            py: 1,
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          New Audit
        </Button>
      </Box>

      <Box sx={{ mb: 5 }}>
        <KeywordsMatchedHeader
          matchedKeywords={matchedKeywords}
          allKeywords={allKeywords}
          showUnmatched
        />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "20px",
          mb: 4,
          color: "#3C3C3C",
        }}
      >
        Results ({mockResults.length})
      </Typography>

      <Grid container spacing={4}>
        {mockResults.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box sx={{ maxWidth: '500px' }}>
              <ResultCard
                id={item.id} 
                type={item.type}
                title={item.title}
                matchedKeywords={item.matchedKeywords}
                allKeywords={item.allKeywords}
                onViewDetails={() => handleViewDetails(item.id)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ResultsPage;
