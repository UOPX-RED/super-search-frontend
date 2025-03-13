import React, { useState, KeyboardEvent, ChangeEvent} from "react";
import { Box, TextField, Typography } from "@mui/material";
import Chips from "../ChipTabs/chiptabs";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  label = "Keywords to identify",
  placeholder = "Enter keyword...",
  tags,
  onAddTag,
  onRemoveTag,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagsFromInput();
    }
  };

  const addTagsFromInput = () => {
    const newTags = inputValue
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    newTags.forEach((t) => onAddTag(t));
    setInputValue("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputValue.trim() !== "") {
      addTagsFromInput();
    }
  };

  return (
    <Box mb={2}>
      {label && (
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: '10px',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '24px',
            color: '#3C3C3C',
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        size="small"
        sx={{ 
          width: '610px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: inputValue ? 'primary.main' : 'inherit',
          },
        }}
        helperText={inputValue ? "Press Enter or click elsewhere to add keyword" : ""}
      />
      {tags.length > 0 && (
        <Box mt={'21px'}>
          <Typography variant="body2" sx={{ mb: '24px' }}>
            Total ({tags.length})
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <Chips
                key={tag}
                label={tag}
                onDelete={() => onRemoveTag(tag)}
                customColor="rgba(252, 0, 0, 0.6)"
                customTextColor="#292A2E"
                showDeleteOnlyOnHover={true}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TagInput;
