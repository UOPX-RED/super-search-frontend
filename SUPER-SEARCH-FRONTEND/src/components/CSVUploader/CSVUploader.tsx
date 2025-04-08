import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, LinearProgress, Alert, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Papa from 'papaparse';

interface CSVData {
  rowIndex: number;
  data: Record<string, string>;
  text: string;
  originalHeaders: string[]; 
  fileName: string;
}

interface CSVUploaderProps {
  onDataProcessed: (data: CSVData[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);

  const sanitizeData = (data: Record<string, string>): Record<string, string> => {
    const sanitized: Record<string, string> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (!key.trim()) return;
      const sanitizedKey = key.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      if (!sanitizedKey) return;
      const sanitizedValue = value === null || value === undefined ? "" : String(value);
      sanitized[sanitizedKey] = sanitizedValue;
    });
    
    if (Object.keys(sanitized).length === 0) {
      sanitized.row_data = "No valid data in row";
    }
    
    return sanitized;
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.type.includes('text/csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setError(null);
    setProgress(10);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProgress(70);

        try {
          if (results.data.length === 0) {
            setError('CSV file has no data');
            setIsProcessing(false);
            return;
          }

          const originalHeaders = results.meta.fields || [];
          
          const processedData: CSVData[] = [];
          
          (results.data as Record<string, string>[]).forEach((rawRow, index) => {
            const row = sanitizeData(rawRow);
            
            const originalData: Record<string, string> = {};
            originalHeaders.forEach(header => {
              if (rawRow[header] !== undefined) {
                originalData[header] = String(rawRow[header] || '');
              }
            });
            
            let textContent = '';
            
            const contentFields = [
              'text', 'content', 'description', 'curriculum', 'syllabus',
              'course_content', 'program_content', 'details'
            ];
            
            const fieldsToUse = Object.keys(row).filter(key => 
              contentFields.some(field => key.toLowerCase().includes(field))
            );
            
            if (fieldsToUse.length > 0) {
              textContent = fieldsToUse.map(field => row[field]).join('\n\n');
            } else {
              textContent = Object.entries(row).map(([key, value]) => `${key}: ${value}`).join('\n\n');
            }
            
            if (!textContent.trim()) {
              textContent = "No text content available in this row";
            }
            
            processedData.push({
              rowIndex: index + 1, 
              data: { ...row, ...originalData }, 
              text: textContent,
              originalHeaders, 
              fileName: file.name
            });
          });

          setRowCount(processedData.length);
          setProgress(100);
          onDataProcessed(processedData);
        } catch (err) {
          console.error('Error processing CSV:', err);
          setError('Error processing CSV file');
        } finally {
          setIsProcessing(false);
        }
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        setError(`Error parsing CSV: ${err.message}`);
        setIsProcessing(false);
      }
    });
  }, [onDataProcessed]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  return (
    <Box>
      <input
        type="file"
        id="csv-upload"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
      
      {fileName ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2,
            bgcolor: 'rgba(12, 188, 139, 0.08)',
            mb: 2 
          }}
        >
          <Box display="flex" alignItems="center">
            <UploadFileIcon sx={{ color: '#0CBC8B', mr: 1 }} />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {fileName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rowCount} rows processed
              </Typography>
            </Box>
            <Button 
              sx={{ ml: 'auto' }} 
              size="small" 
              component="label"
              htmlFor="csv-upload"
            >
              Change file
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box 
          sx={{
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 5,
            mb: 2,
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(12, 188, 139, 0.08)' : 'transparent',
            transition: 'all 0.3s',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadFileIcon sx={{ fontSize: 48, color: isDragging ? '#0CBC8B' : 'grey.500' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Drag and drop your CSV file here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Each row will be processed as a separate source
          </Typography>
          <Button
            variant="outlined"
            component="label"
            htmlFor="csv-upload"
            startIcon={<UploadFileIcon />}
            sx={{ 
              borderColor: '#0CBC8B',
              color: '#0CBC8B',
              '&:hover': {
                borderColor: '#0aa87a',
                backgroundColor: 'rgba(12, 188, 139, 0.08)'
              }
            }}
            disabled={isProcessing}
          >
            Browse Files
          </Button>
        </Box>
      )}
      
      {isProcessing && (
        <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: 'rgba(12, 188, 139, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#0CBC8B'
              }
            }}
          />
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            Processing CSV file...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default CSVUploader;