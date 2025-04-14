/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { 
  Modal, Paper, Box, Typography, IconButton, Chip, 
  CircularProgress, Button, TextField, Tabs, Tab, 
  ToggleButton, ToggleButtonGroup
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import axios from "axios";

interface FullTextSuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  originalText: string;
  keywords: string[];
  sourceId: string;
  contentType: string;
  metadata?: any;
}

const FullTextSuggestionsModal: React.FC<FullTextSuggestionsModalProps> = ({
  open,
  onClose,
  originalText,
  keywords,
  sourceId,
  contentType,
  metadata,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'stacked'>('split');
  const [highlightKeywords, setHighlightKeywords] = useState(true);

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

  const fetchSuggestions = async (useCustomPrompt = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const maxLength = 8000;
      const textToProcess = originalText.length > maxLength 
        ? originalText.substring(0, maxLength) + "..." 
        : originalText;
      
      const keywordsStr = keywords.join(", ");
      
      const defaultPrompt = `Please rewrite the following educational text to avoid using terms related to: ${keywordsStr}. 
      Preserve the educational meaning and context, but replace or rephrase sections containing these keywords.
      Provide 3 alternative versions of the full text, each with different approaches to rewording.
      
      Original text: "${textToProcess}"`;
      
      const requestPrompt = useCustomPrompt && customPrompt ? customPrompt : defaultPrompt;
      
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      
      const payload = {
        source_id: sourceId || "full-text",
        content_type: contentType || "text",
        original_text: textToProcess,
        keywords: keywords,
        metadata: metadata || {},
        prompt: requestPrompt,
        mode: "full_text"
      };
      
      console.log("Sending full text suggestion request");
      
      const token = localStorage.getItem("userToken");
      const headers = token ? { "X-Azure-Token": token } : {};
      
      const response = await axios.post(`${BACKEND_URL}/api/full-sentence-suggestion`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      });
      
      if (response.data && response.data.alternatives && response.data.alternatives.length > 0) {
        setSuggestions(response.data.alternatives);
        setCurrentTabIndex(0); 
      } else {
        setError("No alternative suggestions were found. Try refining your prompt.");
      }
    } catch (err: any) {
      console.error("Error fetching full text suggestions:", err);
      setError(`Failed to get suggestions: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabIndex(newValue);
  };

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(index);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const highlightText = (text: string) => {
    if (!highlightKeywords || keywords.length === 0) return text;
    
    const keywordPattern = keywords
      .map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length)
      .join('|');
      
    const regex = new RegExp(`(${keywordPattern})`, 'gi');
    
    const parts = text.split(regex);
    
    return parts.map((part) => {
      const isKeyword = keywords.some(kw => 
        part.toLowerCase() === kw.toLowerCase());
        
      if (isKeyword) {
        return `<span style="background-color: rgba(219, 55, 37, 0.18); color: #DB3725; padding: 0px 1px; border-radius: 2px;">${part}</span>`;
      }
      return part;
    }).join('');
  };

  return (
    <Modal
      open={open}
      onClose={handleSafeClose}
      aria-labelledby="ai-full-text-suggestions-modal"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '85%', lg: '85%' },
          maxWidth: '1400px',
          maxHeight: '92vh',
          overflow: 'hidden',
          p: 0,
          borderRadius: 2,
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          bgcolor: 'rgb(0, 179, 115, 0.08)'
        }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHighIcon sx={{ color: 'rgb(0, 179, 115)' }} />
            AI Text Improvement
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
              aria-label="view mode"
            >
              <ToggleButton value="split" aria-label="split view">
                <VerticalSplitIcon sx={{ fontSize: '1.2rem' }} />
              </ToggleButton>
              <ToggleButton value="stacked" aria-label="stacked view">
                <ViewAgendaIcon sx={{ fontSize: '1.2rem' }} />
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButton
              value="highlight"
              selected={highlightKeywords}
              onChange={() => setHighlightKeywords(!highlightKeywords)}
              size="small"
              sx={{ 
                borderColor: 'rgba(0, 0, 0, 0.12)', 
                px: 1
              }}
            >
              <Typography variant="caption" sx={{ mr: 0.5 }}>Highlight Keywords</Typography>
            </ToggleButton>
            
            <IconButton onClick={handleSafeClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Keywords Section */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Keywords to Replace:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {keywords.map((word, idx) => (
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

        {/* Content Section */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: viewMode === 'split' ? 'row' : 'column'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 5,
              width: '100%' 
            }}>
              <CircularProgress size={40} sx={{ color: 'rgb(0, 179, 115)', mb: 2 }} />
              <Typography>Generating improved versions...</Typography>
              <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                This may take a while for longer texts
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, width: '100%' }}>
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
              {/* Original Text Panel */}
              <Box sx={{ 
                width: viewMode === 'split' ? '50%' : '100%', 
                p: 3,
                overflow: 'auto',
                borderRight: viewMode === 'split' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                borderBottom: viewMode === 'stacked' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    Original Text
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyToClipboard(originalText, -1)}
                    sx={{ color: copySuccess === -1 ? 'rgb(0, 179, 115)' : 'text.secondary' }}
                  >
                    {copySuccess === -1 ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Box>
                
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    whiteSpace: 'pre-line',
                    minHeight: '60vh',
                    maxHeight: 'calc(80vh - 200px)',
                    overflow: 'auto'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    component="div"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(originalText) 
                    }}
                  />
                </Paper>
              </Box>

              {/* Improved Text Panel */}
              <Box sx={{ 
                width: viewMode === 'split' ? '50%' : '100%', 
                p: 3,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {suggestions.length > 1 && (
                  <Tabs 
                    value={currentTabIndex} 
                    onChange={handleTabChange}
                    sx={{ mb: 2 }}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {suggestions.map((_, idx) => (
                      <Tab 
                        key={idx} 
                        label={`Version ${idx + 1}`} 
                        sx={{ 
                          fontWeight: 500,
                          color: 'rgb(0, 179, 115)',
                          '&.Mui-selected': {
                            color: 'rgb(0, 179, 115)',
                            fontWeight: 600
                          }
                        }}
                      />
                    ))}
                  </Tabs>
                )}
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'rgb(0, 140, 90)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <AutoFixHighIcon sx={{ fontSize: '1rem' }} />
                    Improved Version {suggestions.length > 1 ? currentTabIndex + 1 : ''}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyToClipboard(suggestions[currentTabIndex] || '', currentTabIndex)}
                    sx={{ color: copySuccess === currentTabIndex ? 'rgb(0, 179, 115)' : 'text.secondary' }}
                  >
                    {copySuccess === currentTabIndex ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Box>
                
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 179, 115, 0.04)',
                    border: '1px solid rgba(0, 179, 115, 0.2)',
                    whiteSpace: 'pre-line',
                    minHeight: '60vh',
                    maxHeight: 'calc(80vh - 200px)',
                    overflow: 'auto',
                    flex: 1
                  }}
                >
                  <Typography 
                    variant="body1" 
                    component="div"
                    dangerouslySetInnerHTML={{ 
                      __html: suggestions[currentTabIndex] 
                        ? highlightText(suggestions[currentTabIndex]) 
                        : 'No alternative available'
                    }}
                  />
                </Paper>
              </Box>
            </>
          )}
        </Box>

        {/* Footer Section */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Button 
            variant="outlined" 
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            sx={{
              borderColor: 'rgb(0, 179, 115)',
              color: 'rgb(0, 179, 115)',
              '&:hover': {
                borderColor: 'rgb(0, 159, 105)',
                backgroundColor: 'rgba(0, 179, 115, 0.04)'
              }
            }}
          >
            {showCustomPrompt ? 'Hide Prompt Editor' : 'Customize Prompt'}
          </Button>
          
          {!loading && !error && suggestions.length > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {suggestions.length} alternative version{suggestions.length !== 1 ? 's' : ''} available
            </Typography>
          )}
        </Box>
        
        {/* Custom Prompt Section */}
        {showCustomPrompt && (
          <Box sx={{ p: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Customize the AI Prompt:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={`Please rewrite the text to avoid using terms related to ${keywords.join(', ')} while maintaining the educational context and meaning.`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={() => fetchSuggestions(true)}
              disabled={!customPrompt.trim() || loading}
              sx={{
                bgcolor: 'rgb(0, 179, 115)',
                '&:hover': { bgcolor: 'rgb(0, 159, 105)' },
                '&:disabled': { bgcolor: 'rgba(0, 0, 0, 0.12)' }
              }}
            >
              Generate New Versions
            </Button>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

export default FullTextSuggestionsModal;