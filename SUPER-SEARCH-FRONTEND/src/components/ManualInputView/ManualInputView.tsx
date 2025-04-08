/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Tabs,
  Tab,
  Divider,
  IconButton,
  styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TextFields from '@mui/icons-material/TextFields';
import CSVUploader from '../CSVUploader/CSVUploader';

interface MetadataField {
  key: string;
  value: string;
  id: number;
}

interface ManualInputViewProps {
  textValue: string;
  onTextChange: (value: string) => void;
  metadataKey: string;
  onMetadataKeyChange: (value: string) => void;
  metadataValue: string;
  onMetadataValueChange: (value: string) => void;
  onCsvDataProcessed: (data: any[]) => void;
}

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 4,
  },
}));

const ManualInputView: React.FC<ManualInputViewProps> = ({
  textValue,
  onTextChange,
  metadataKey,
  onMetadataKeyChange,
  metadataValue,
  onMetadataValueChange,
  onCsvDataProcessed
}) => {
  const [inputMethod, setInputMethod] = useState<'text' | 'csv'>('text');
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([
    { key: metadataKey, value: metadataValue, id: 0 }
  ]);

  const addField = () => {
    const newField = { 
      key: "", 
      value: "", 
      id: metadataFields.length > 0 ? Math.max(...metadataFields.map(f => f.id)) + 1 : 0 
    };
    setMetadataFields([...metadataFields, newField]);
  };

  const removeField = (id: number) => {
    setMetadataFields(metadataFields.filter(field => field.id !== id));
  };

  const updateField = (id: number, field: "key" | "value", newValue: string) => {
    setMetadataFields(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: newValue }
          : item
      )
    );

    if (id === 0) {
      if (field === "key") {
        onMetadataKeyChange(newValue);
      } else {
        onMetadataValueChange(newValue);
      }
    }
  };

  const getAllMetadata = () => {
    const metadata: Record<string, string> = {};
    metadataFields.forEach(field => {
      if (field.key.trim()) {
        metadata[field.key] = field.value;
      }
    });
    return metadata;
  };

  const handleCSVDataProcessed = (csvData: any[]) => {
    onCsvDataProcessed(csvData);

    if (csvData.length > 0) {
      const firstRow = csvData[0];
      const headers = firstRow.originalHeaders || Object.keys(firstRow.data);

      const headerPreview = headers.join(', ');
      const valuesPreview = headers
        .map((header: string | number) => firstRow.data[header] || '')
        .join(', ');

    const preview =
        `CSV File: ${firstRow.fileName || 'Uploaded file'}\n` +
        `Rows: ${csvData.length}\n` +
        `Headers: ${headerPreview}\n\n` +
        `Preview of row 1:\n` +
        `${valuesPreview.substring(0, 500)}${
          valuesPreview.length > 500 ? '...' : ''
        }`;

      onTextChange(preview);
    }
  };

  return (
    <Box>
      <Tabs
        value={inputMethod}
        onChange={(_, newValue) => setInputMethod(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: '#000000',
            fontWeight: 500,
          },
        }}
      >
        <Tab
          value="text"
          label="Text Input"
          icon={<TextFields />}
          iconPosition="start"
          sx={{
            textTransform: 'none',
            fontSize: '16px',
          }}
        />
        <Tab
          value="csv"
          label="CSV Upload"
          icon={<UploadFileIcon />}
          iconPosition="start"
          sx={{
            textTransform: 'none',
            fontSize: '16px',
          }}
        />
      </Tabs>

      {inputMethod === 'text' ? (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Paste your text here
          </Typography>
          <TextField
            multiline
            rows={6}
            placeholder="Enter the text you want to analyze..."
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <Box sx={{ mb: 2, mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#3C3C3C',
                  mb: 1,
                }}
              >
                Additional Info
              </Typography>
            </Box>

            {metadataFields.map((field, index) => (
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                key={field.id}
                sx={{ mb: 2 }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#3C3C3C',
                    minWidth: '40px',
                  }}
                >
                  Field
                </Typography>
                <StyledTextField
                  size="small"
                  value={field.key}
                  onChange={(e) => updateField(field.id, 'key', e.target.value)}
                  sx={{
                    width: '120px',
                    '& .MuiOutlinedInput-root': {
                      height: '32px',
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#3C3C3C',
                    minWidth: '40px',
                    ml: 2,
                  }}
                >
                  Value
                </Typography>
                <StyledTextField
                  size="small"
                  value={field.value}
                  onChange={(e) => updateField(field.id, 'value', e.target.value)}
                  sx={{
                    width: '280px',
                    '& .MuiOutlinedInput-root': {
                      height: '32px',
                    },
                  }}
                />
                {index === metadataFields.length - 1 ? (
                  <IconButton
                    onClick={addField}
                    sx={{
                      backgroundColor: '#00B373',
                      color: '#fff',
                      borderRadius: 1,
                      height: 40,
                      width: 40,
                      ml: 1,
                      '&:hover': {
                        backgroundColor: '#00A366',
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => removeField(field.id)}
                    sx={{
                      color: '#666',
                      ml: 1,
                      '&:hover': {
                        color: '#f44336',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          <input
            type="hidden"
            id="allMetadata"
            value={JSON.stringify(getAllMetadata())}
          />
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Upload CSV file for bulk processing
          </Typography>
          <CSVUploader onDataProcessed={handleCSVDataProcessed} />
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Each row in your CSV will be processed as a separate source.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ManualInputView;