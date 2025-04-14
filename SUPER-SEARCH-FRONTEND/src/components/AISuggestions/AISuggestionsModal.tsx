/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { 
  Modal, Paper, Box, Typography, IconButton, Chip, 
  CircularProgress, Button, TextField
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CloseIcon from "@mui/icons-material/Close";
import { getAlternativeTextSuggestions } from '../../services/textSuggestionService';

interface AlternativeSuggestion {
  problematicPhrase: string;
  alternatives: any[];
  reason: string;
  concept_matched: string;
  confidence: number;
}

interface AISuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  matchedText: string;
  displayKeywords: string[];
  sourceId: string;
  contentType: string;
  metadata?: any;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({
  open,
  onClose,
  matchedText,
  displayKeywords,
  sourceId,
  contentType,
  metadata,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AlternativeSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const handleSafeClose = () => {
    try {
      if (showCustomPrompt) {
        setShowCustomPrompt(false);
      }
      setTimeout(() => {
        onClose();
      }, 0);
    } catch (error) {
      console.error("Error closing modal:", error);
      onClose();
    }
  };

  useEffect(() => {
    if (open && suggestions.length === 0) {
      fetchSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const formatAlternative = (alt: any): string => {
    if (alt === null || alt === undefined) return '';
    if (typeof alt === 'string') return alt;
    if (typeof alt === 'object') {
      if (alt.text) return alt.text;
      if (alt.suggestion) return alt.suggestion;
      if (alt.value) return alt.value;
      return JSON.stringify(alt);
    }
    return String(alt);
  };

  const fetchSuggestions = async (useCustomPrompt = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const keyword = displayKeywords && displayKeywords.length > 0 
        ? displayKeywords[0]
        : "the highlighted text";
      
      const defaultPrompt = `Please provide 3-5 alternative ways to express "${matchedText}" that avoid using terms related to ${keyword}. 
      Keep the educational context and meaning intact. Be creative and offer substantively different alternatives.`;
      
      const payload = {
        source_id: sourceId || "highlighted-text",
        content_type: contentType || "text",
        sentence: matchedText,
        keywords: displayKeywords,
        metadata: metadata || {},
        req_prompt: useCustomPrompt && customPrompt ? customPrompt : defaultPrompt
      };
      
      console.log("Sending payload for suggestions:", payload);
      
      const data = await getAlternativeTextSuggestions(payload);
      console.log("Received suggestions data:", data);
      
      if (data && data.alternative_suggestions && data.alternative_suggestions.length > 0) {
        const processedSuggestions = data.alternative_suggestions.map((suggestion: any) => {
          const processed = { ...suggestion };
          
          if (processed.alternatives) {
            processed.alternatives = processed.alternatives.map(formatAlternative);
          } else {
            processed.alternatives = [];
          }
          
          return processed;
        });
        
        setSuggestions(processedSuggestions);
      } else {
        setError("No alternative suggestions were found. Try refining your prompt.");
      }
    } catch (err: any) {
      console.error("Error fetching suggestions:", err);
      setError(`Failed to get suggestions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleSafeClose}
      aria-labelledby="ai-suggestions-modal"
      aria-describedby="ai-suggestions-for-highlighted-text"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          p: 4,
          borderRadius: 2,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHighIcon sx={{ color: 'rgb(0, 179, 115)' }} />
            AI Text Suggestions
          </Typography>
          <IconButton onClick={handleSafeClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Original Text:</Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: 2,
              fontStyle: 'italic',
            }}
          >
            <Typography>{matchedText}</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Keywords:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {displayKeywords.map((word, idx) => (
              <Chip
                key={`modal-${word}-${idx}`}
                label={word}
                size="small"
                sx={{
                  backgroundColor: "#DB3725",
                  color: "#FFFFFF",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
            <CircularProgress size={40} sx={{ color: 'rgb(0, 179, 115)', mb: 2 }} />
            <Typography>Generating suggestions...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ mb: 3 }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: 'rgb(0, 179, 115)',
                '&:hover': { bgcolor: 'rgb(0, 159, 105)' },
              }}
              onClick={() => fetchSuggestions()}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              {suggestions.map((suggestion, index) => (
                <Box key={index} sx={{ mb: 4, p: 2, bgcolor: 'rgba(0, 179, 115, 0.04)', borderRadius: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Problematic Phrase:
                    </Typography>
                    <Chip 
                      label={suggestion.problematicPhrase} 
                      sx={{
                        bgcolor: 'rgba(219, 55, 37, 0.1)',
                        color: '#DB3725',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Alternatives:
                    </Typography>
                    {suggestion.alternatives && suggestion.alternatives.map((alt, i) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          p: 1.5, 
                          mb: 1,
                          bgcolor: 'rgb(0, 179, 115, 0.1)',
                          color: 'rgb(0, 179, 115)',
                          fontWeight: 500,
                          borderRadius: 1,
                          border: '1px solid rgba(0, 179, 115, 0.2)',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}
                      >
                        {String(alt)}
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Reason:
                    </Typography>
                    <Typography variant="body2">
                      {suggestion.reason}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Confidence:</span>
                      <span>{Math.round((suggestion.confidence || 0) * 100)}%</span>
                    </Typography>
                    <Box sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.1)', height: 8, borderRadius: 4 }}>
                      <Box
                        sx={{
                          width: `${Math.round((suggestion.confidence || 0) * 100)}%`,
                          bgcolor: 'rgb(0, 179, 115)',
                          height: '100%',
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                sx={{
                  borderColor: 'rgb(0, 179, 115)',
                  color: 'rgb(0, 179, 115)',
                  '&:hover': {
                    borderColor: 'rgb(0, 159, 105)',
                    backgroundColor: 'rgba(0, 179, 115, 0.04)'
                  },
                  mb: 2
                }}
              >
                {showCustomPrompt ? 'Hide Custom Prompt' : 'Customize Prompt'}
              </Button>
              
              {showCustomPrompt && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Custom Prompt"
                    placeholder={`Please suggest alternatives for this text that avoid using phrases related to ${displayKeywords[0]} while maintaining the educational context and meaning`}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => fetchSuggestions(true)}
                    disabled={!customPrompt.trim()}
                    sx={{
                      bgcolor: 'rgb(0, 179, 115)',
                      '&:hover': { bgcolor: 'rgb(0, 159, 105)' },
                      '&:disabled': { bgcolor: 'rgba(0, 0, 0, 0.12)' }
                    }}
                  >
                    Get New Suggestions
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default AISuggestionsModal;