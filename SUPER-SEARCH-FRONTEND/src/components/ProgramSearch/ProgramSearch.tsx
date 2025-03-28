import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Autocomplete, 
  CircularProgress, 
  Divider, 
  Alert,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import Chips from "../ChipTabs/chiptabs";
import { usePrograms } from '../../hooks/usePrograms';

interface Program {
  code: string;
  title: string;
  collegeName: string;
  levelName: string;
  isActive: boolean;
}

interface ProgramSearchProps {
  onProgramSelect: (programInfo: Program | null) => void;
  selectedProgram: string | null;
}

const ProgramSearch: React.FC<ProgramSearchProps> = ({ 
  onProgramSelect,
  selectedProgram
}) => {
  const [programInputMethod, setProgramInputMethod] = useState<'dropdown' | 'manual' | 'all'>('dropdown');
  
  const [allProgramsSelected, setAllProgramsSelected] = useState(false);
  
  const [manualProgramCode, setManualProgramCode] = useState("");
  
  const [selectedProgramCode, setSelectedProgramCode] = useState<string | null>(selectedProgram);
  
  const [manualProgramError, setManualProgramError] = useState<string | null>(null);
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const { programs, loading: programsLoading, error: programsError } = usePrograms();
  
  const handleProgramInputMethodChange = (_event: React.SyntheticEvent, newValue: 'dropdown' | 'manual' | 'all') => {
    setProgramInputMethod(newValue);
    setManualProgramError(null);
    
    if (newValue === 'all') {
      if (programs.length > 20) {
        setConfirmDialogOpen(true);
      } else {
        handleSelectAllPrograms();
      }
    } else {
      setAllProgramsSelected(false);
    }
  };
  
  const handleConfirmSelectAll = () => {
    setConfirmDialogOpen(false);
    handleSelectAllPrograms();
  };
  
  const handleDeclineSelectAll = () => {
    setConfirmDialogOpen(false);
    setProgramInputMethod('dropdown');
  };
  
  const handleSelectAllPrograms = () => {
    setAllProgramsSelected(true);
    
    if (programs.length > 0) {
      const firstProgram = programs[0];
      setSelectedProgramCode(firstProgram.code);
      onProgramSelect(firstProgram);
    }
  };
  
  const handleProgramSelect = (programCode: string | null) => {
    if (!programCode) return;
    
    setSelectedProgramCode(programCode);
    
    const program = programs.find(p => p.code === programCode);
    if (program) {
      onProgramSelect(program);
    }
  };
  
  const handleManualProgramInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualProgramCode(event.target.value);
    setManualProgramError(null);
  };
  
  const handleManualProgramSubmit = (event: React.KeyboardEvent<HTMLDivElement> | null = null) => {
    if (event && event.key !== "Enter") return;
    
    const programCode = manualProgramCode.trim();
    if (!programCode) return;
    
    const program = programs.find(p => p.code === programCode);
    if (!program) {
      setManualProgramError(`Program code "${programCode}" not found in the list`);
      return;
    }
    
    setSelectedProgramCode(programCode);
    onProgramSelect(program);
    setManualProgramError(null);
    setManualProgramCode("");
  };

  return (
    <Box mt={4}>
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "24px",
          color: "#3C3C3C",
          mb: 2
        }}
      >
        Program Selection
      </Typography>
      
      <Tabs 
        value={programInputMethod} 
        onChange={handleProgramInputMethodChange}
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            color: '#000000',
            fontWeight: 500
          },
          '& .Mui-selected': {
            color: '#000000',
            fontWeight: 600
          }
        }}
      >
        <Tab value="dropdown" label="Select from List"/>
        <Tab value="manual" label="Manual Entry" />
        <Tab value="all" label="Select All" />
      </Tabs>
      
      {programInputMethod === 'dropdown' && (
        <Autocomplete
          options={programs.map(program => program.code)}
          getOptionLabel={(option) => {
            const program = programs.find(p => p.code === option);
            return program ? `${option} - ${program.title}` : option;
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Select a program" 
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                sx: { color: '#000000' },
                endAdornment: (
                  <React.Fragment>
                    {programsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          onChange={(_, value) => handleProgramSelect(value)}
          value={selectedProgramCode}
          loading={programsLoading}
          sx={{ width: "610px", mb: 2 }}
        />
      )}
      
      {programInputMethod === 'manual' && (
        <Box>
          <TextField
            label="Enter program code"
            placeholder="Example: BSB/ACC"
            value={manualProgramCode}
            onChange={handleManualProgramInput}
            onKeyDown={(e) => e.key === "Enter" && handleManualProgramSubmit(e)}
            size="small"
            fullWidth
            error={!!manualProgramError}
            sx={{ width: "610px", mb: manualProgramError ? 1 : 2 }}
            helperText={manualProgramError ? null : "Press Enter to submit"}
          />
          
          <Button 
            variant="contained" 
            onClick={() => handleManualProgramSubmit()}
            sx={{ 
              mt: 1, 
              mb: 2,
              backgroundColor: "#0CBC8B",
              color: "#FFFFFF",
              borderRadius: "100px",
              boxShadow: "0px 4px 10px rgba(12, 188, 139, 0.3)",
              "&:hover": {
                backgroundColor: "#0aa87a",
              }
            }}
          >
            Add Program
          </Button>
          
          {manualProgramError && (
            <Alert severity="error" sx={{ width: "610px", mb: 2 }}>
              {manualProgramError}
            </Alert>
          )}
        </Box>
      )}
      
      {programInputMethod === 'all' && (
        <Alert 
          severity={allProgramsSelected ? "success" : "info"} 
          sx={{ width: "610px", mb: 2 }}
        >
          {programsLoading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Loading programs...
            </Box>
          ) : allProgramsSelected ? (
            `All programs are selected. Using ${programs[0]?.title || "first program"} for processing.`
          ) : (
            `${programs.length} programs are available to be selected.`
          )}
        </Alert>
      )}
      
      {programsError && (
        <Alert severity="error" sx={{ width: "610px", mb: 2 }}>
          {programsError}
        </Alert>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {selectedProgramCode && (
        <Box mt="18px">
          <Typography variant="body1" sx={{ mb: "20px", color: "#000000" }}>
            Selected Program
          </Typography>
          
          {(() => {
            const program = programs.find(p => p.code === selectedProgramCode);
            if (program) {
              return (
                <Box>
                  <Chips
                    key={program.code}
                    label={`${program.code} - ${program.title}`}
                    onDelete={() => {
                      setSelectedProgramCode(null);
                      onProgramSelect(null);
                    }}
                    customColor="rgba(54, 124, 255, 0.2)"
                    customTextColor="#292A2E"
                    customHoverColor="rgba(54, 124, 255, 0.4)"
                    showDeleteOnlyOnHover
                  />
                  
                  <Box mt={2} sx={{ color: '#000000' }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>College:</strong> {program.collegeName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Level:</strong> {program.levelName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {program.isActive ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                </Box>
              );
            }
            return null;
          })()}
        </Box>
      )}
      
      <Dialog
        open={confirmDialogOpen}
        onClose={handleDeclineSelectAll}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select all programs?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to select all ${programs.length} programs? This might take a while to process.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeclineSelectAll} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSelectAll} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgramSearch;