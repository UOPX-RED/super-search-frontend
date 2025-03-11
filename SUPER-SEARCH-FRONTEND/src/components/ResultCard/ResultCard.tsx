import React from "react";
import { Box, Typography, Button, Card, Chip } from "@mui/material";

interface ResultCardProps {
  id: string;
  type: string;
  title: string;
  matchedKeywords: string[];
  allKeywords: string[];
  onViewDetails: () => void;
}

const KeywordsMatchedHeader: React.FC<{
  matchedKeywords: string[];
  allKeywords: string[];
  showUnmatched?: boolean;
}> = ({ matchedKeywords, allKeywords, showUnmatched = false }) => {
  const unmatched = showUnmatched
    ? allKeywords.filter((kw) => !matchedKeywords.includes(kw))
    : [];

  return (
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
        Keywords matched ({matchedKeywords.length}/{allKeywords.length})
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

        {showUnmatched &&
          unmatched.map((kw) => (
            <Chip
              key={`unmatched-${kw}`}
              label={kw}
              sx={{
                backgroundColor: "#3C3C3C",
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
  );
};

const ResultCard: React.FC<ResultCardProps> = ({
  type,
  title,
  matchedKeywords,
  allKeywords,
  onViewDetails,
}) => {
  // const matchedCount = matchedKeywords.length;
  // const totalCount = allKeywords.length;

  return (
    <Card
      variant="outlined"
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            display: "block",
            mb: 1.5,
            fontSize: "14px",
            color: "#3C3C3C",
          }}
        >
          {type === "course" ? "Course" : "Policy"}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            color: "#919090",
            mb: 2,
            fontSize: "18px",
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>

        <KeywordsMatchedHeader
          matchedKeywords={matchedKeywords}
          allKeywords={allKeywords}
          showUnmatched={true}
        />
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-start">
        <Button
          variant="contained"
          onClick={onViewDetails}
          sx={{
            textTransform: "none",
            backgroundColor: "#000",
            color: "#FFF",
            width: "100%",
            padding: "8px 24px",
            "&:hover": { backgroundColor: "#333" },
            borderRadius: "4px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default ResultCard;
