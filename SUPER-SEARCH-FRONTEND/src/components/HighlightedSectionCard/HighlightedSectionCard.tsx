import React, { useState } from "react";
import { Card, Box, Typography, Chip, IconButton } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { scrollAndHighlightText } from "../../utils/textHighlighter";
import AISuggestionsModal from "../AISuggestions/AISuggestionsModal";

interface HighlightedSectionProps {
  matchedWord: string[];
  confidence: string | number;
  matchedText: string;
  reason: string;
  start_index?: number;
  end_index?: number;
  conceptMatched?: string;
  sourceId: string;
  contentType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

const HighlightedSectionCard: React.FC<HighlightedSectionProps> = ({
  matchedWord,
  confidence,
  matchedText,
  reason,
  start_index,
  end_index,
  conceptMatched,
  sourceId,
  contentType,
  metadata,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  const displayKeywords = conceptMatched 
    ? [conceptMatched] 
    : matchedWord;

  const handleSuggestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  return (
    <>
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
          position: 'relative'
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flex: 1 }}>
            {displayKeywords.map((word, idx) => (
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
        
        <IconButton
          onClick={handleSuggestClick}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgb(0, 179, 115, 0.1)',
            color: 'rgb(0, 179, 115)',
            '&:hover': {
              bgcolor: 'rgb(0, 179, 115, 0.2)',
            },
          }}
          size="small"
          title="Get AI suggestions for alternative text"
        >
          <AutoFixHighIcon fontSize="small" />
        </IconButton>
      </Card>

      <AISuggestionsModal
        open={modalOpen}
        onClose={handleModalClose}
        matchedText={matchedText}
        displayKeywords={displayKeywords}
        sourceId={sourceId}
        contentType={contentType}
        metadata={metadata}
      />
    </>
  );
};

export default HighlightedSectionCard;
