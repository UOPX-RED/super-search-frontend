import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
}) => {
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
    setMetadataFields(metadataFields.map(item => {
      if (item.id === id) {
        return { ...item, [field]: newValue };
      }
      return item;
    }));

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

  return (
    <Box mt={2}>
      <StyledTextField
        multiline
        rows={5}
        fullWidth
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter text..."
        sx={{ mb: 2, width: '610px'  }}
      />

      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "16px",
              color: "#3C3C3C",
              mb: 1,
            }}
          >
            Additional Info
          </Typography>
        </Box>

        {metadataFields.map((field, index) => (
          <Box display="flex" alignItems="center" gap={2} key={field.id} sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "16px",
                color: "#3C3C3C",
                minWidth: "40px",
              }}
            >
              Field
            </Typography>
            <StyledTextField
              size="small"
              value={field.key}
              onChange={(e) => updateField(field.id, "key", e.target.value)}
              sx={{ 
                width: "120px",
                '& .MuiOutlinedInput-root': {
                  height: '32px'
                }
              }}
            />
            
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "16px",
                color: "#3C3C3C",
                minWidth: "40px",
                ml: 2,
              }}
            >
              Value
            </Typography>
            <StyledTextField
              size="small"
              value={field.value}
              onChange={(e) => updateField(field.id, "value", e.target.value)}
              sx={{ 
                width: "280px",
                '& .MuiOutlinedInput-root': {
                  height: '32px'
                }
              }}
            />
            
            {index === metadataFields.length - 1 ? (
              <IconButton
                onClick={addField}
                sx={{
                  backgroundColor: "#00B373",
                  color: "#fff",
                  borderRadius: 1,
                  height: 40,
                  width: 40,
                  ml: 1,
                  "&:hover": {
                    backgroundColor: "#00A366",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => removeField(field.id)}
                sx={{
                  color: "#666",
                  ml: 1,
                  "&:hover": {
                    color: "#f44336",
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
  );
};

export default ManualInputView;