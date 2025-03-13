import React from "react";
import { Card, Box, Typography, Chip } from "@mui/material";
import { scrollAndHighlightText } from "../../utils/textHighlighter";

interface HighlightedSectionProps {
  matchedWord: string[];
  confidence: string | number;
  matchedText: string;
  reason: string;
  start_index?: number;
  end_index?: number;
}

const HighlightedSectionCard: React.FC<HighlightedSectionProps> = ({
  matchedWord,
  confidence,
  matchedText,
  reason,
  start_index,
  end_index,
}) => {
  const handleCardClick = () => {
    if (typeof start_index === 'number' && typeof end_index === 'number') {
      scrollAndHighlightText(
        start_index,
        end_index,
        'original-text-container',
        matchedText 
      );
    }
  };

  const confidenceDisplay = typeof confidence === 'number' 
    ? `${Math.round(confidence * 100)}%` 
    : confidence;

  const isClickable = typeof start_index === 'number' && typeof end_index === 'number';

  return (
    <Card
      variant="outlined"
      className={isClickable ? "clickable-card" : ""}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e0e0e0",
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': isClickable ? {
          transform: 'translateY(-2px)',
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
        } : {},
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flex: 1 }}>
          {matchedWord.map((word, idx) => (
            <Chip
              key={`${word}-${idx}`}
              label={word}
              sx={{
                backgroundColor: "#DB3725",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: "12px",
                height: "24px",
                borderRadius: "12px",
              }}
            />
          ))}
        </Box>
        <Typography variant="body2" sx={{fontWeight: 600}}>
          Confidence: {confidenceDisplay}
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
        <Typography
          variant="body2"
          sx={{ fontSize: "14px", color: "#919090", fontWeight: 600 }}
        >
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
        <Typography
          variant="body2"
          sx={{ fontSize: "14px", color: "#919090", fontWeight: 600 }}
        >
          {reason}
        </Typography>
      </Box>
    </Card>
  );
};

export default HighlightedSectionCard;
