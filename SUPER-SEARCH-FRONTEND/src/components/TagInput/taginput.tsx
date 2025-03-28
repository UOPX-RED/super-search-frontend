import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Box, TextField, Typography, Button, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField as MuiTextField } from "@mui/material";
import Chips from "../ChipTabs/chiptabs";
import SaveIcon from '@mui/icons-material/Save';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useKeywordSets, KeywordSet } from "../../hooks/useKeywordSets";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [setNameInput, setSetNameInput] = useState("");
  
  const { savedSets, saveKeywordSet } = useKeywordSets();

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

  const handleSaveKeywords = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
    setSetNameInput("");
  };

  const handleSaveSet = () => {
    if (saveKeywordSet(setNameInput, tags)) {
      handleSaveDialogClose();
    }
  };

  const handleLoadMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoadMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoadKeywordSet = (set: KeywordSet) => {
    set.keywords.forEach(keyword => {
      if (!tags.includes(keyword)) {
        onAddTag(keyword);
      }
    });
    handleLoadMenuClose();
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
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
        <Box sx={{ display: 'flex', mt: 0.5 }}>
          <IconButton 
            size="small" 
            onClick={handleSaveKeywords}
            disabled={tags.length === 0}
            title="Save keywords"
            sx={{ 
              color: tags.length > 0 ? 'rgb(0, 179, 115)' : 'gray',
              '&:hover': { bgcolor: 'rgba(0, 179, 115, 0.1)' }
            }}
          >
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleLoadMenuOpen}
            disabled={savedSets.length === 0}
            title="Load saved keywords"
            sx={{ 
              color: savedSets.length > 0 ? 'rgb(0, 179, 115)' : 'gray',
              '&:hover': { bgcolor: 'rgba(0, 179, 115, 0.1)' }
            }}
          >
            <BookmarkIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
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

      <Dialog open={saveDialogOpen} onClose={handleSaveDialogClose}>
        <DialogTitle>Save Keywords</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Preset Name"
            fullWidth
            variant="outlined"
            value={setNameInput}
            onChange={(e) => setSetNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSet} 
            color="primary"
            disabled={setNameInput.trim() === ""}
            sx={{ backgroundColor: "rgb(0, 179, 115)", color: "white", "&:hover": { backgroundColor: "rgb(0, 159, 105)" }, "&:disabled": { backgroundColor: "#cccccc" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLoadMenuClose}
      >
        {savedSets.map((set) => (
          <MenuItem 
            key={set.name}
            onClick={() => handleLoadKeywordSet(set)}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              '&:hover': { bgcolor: 'rgba(0, 179, 115, 0.1)' }
            }}
          >
            <span>{set.name}</span>
            <span style={{ marginLeft: '12px', fontSize: '0.8em', color: '#666' }}>
              ({set.keywords.length})
            </span>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default TagInput;
