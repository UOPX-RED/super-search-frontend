import React from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  styled
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

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

      <Box display="flex" alignItems="center" gap={2}>
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
          value={metadataKey}
          onChange={(e) => onMetadataKeyChange(e.target.value)}
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
          value={metadataValue}
          onChange={(e) => onMetadataValueChange(e.target.value)}
          sx={{ 
            width: "280px",
            '& .MuiOutlinedInput-root': {
              height: '32px'
            }
          }}
        />
        
        <IconButton
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
          <CheckIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ManualInputView;