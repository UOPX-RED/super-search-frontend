import React from 'react';
import { Box, Card, Chip, Typography } from "@mui/material";

interface HighlightedSectionProps {
  matchedWord: string;
  confidence: string;
  matchedText: string;
  reason: string;
}

const HighlightedSectionCard: React.FC<HighlightedSectionProps> = ({
  matchedWord,
  confidence,
  matchedText,
  reason
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3, 
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          label={matchedWord}
          sx={{
            backgroundColor: "#DB3725",
            color: "#FFFFFF",
            fontWeight: 500,
            fontSize: "14px",
            height: "28px",
            borderRadius: "14px",
          }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Confidence: {confidence}
        </Typography>
      </Box>

      <Box sx={{ mt: 2.5, px: 0 }}> 
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "14px",
            color: "#3C3C3C",
            mb: 1,
          }}
        >
          Matched text
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "14px", color: "#919090", fontWeight:600 }}>
          {matchedText}
        </Typography>
      </Box>

      <Box sx={{ mt: 2.5, px: 0 }}> 
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "14px",
            color: "#3C3C3C",
            mb: 1,
          }}
        >
          Reason
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "14px", color: "#919090", fontWeight:600 }}>
          {reason}
        </Typography>
      </Box>
    </Card>
  );
};

export default HighlightedSectionCard;