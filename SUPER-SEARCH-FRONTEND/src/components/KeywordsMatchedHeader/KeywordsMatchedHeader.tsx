import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface KeywordsMatchedHeaderProps {
  matchedKeywords: string[];
  allKeywords?: string[];
  showUnmatched?: boolean;
}

const KeywordsMatchedHeader: React.FC<KeywordsMatchedHeaderProps> = ({
  matchedKeywords,
  allKeywords,
  showUnmatched = false,
}) => {
  const unmatched = showUnmatched && allKeywords 
    ? allKeywords.filter(kw => !matchedKeywords.includes(kw))
    : [];
  
  return (
    <Box mb={3}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "18px",
          color: "#3C3C3C",
          mb: 1 
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
        
        {showUnmatched && unmatched.map((kw) => (
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

export default KeywordsMatchedHeader;
