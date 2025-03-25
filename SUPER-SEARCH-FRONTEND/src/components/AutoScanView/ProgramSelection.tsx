import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Typography, 
  Autocomplete, 
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Alert,
} from "@mui/material";
import Chips from "../ChipTabs/chiptabs";

interface Program {
  programId: string;
  title?: string;
  collegeName?: string;
  levelName?: string;
  isActive?: boolean;
}

interface ProgramSelectionProps {
  selectedProgram?: string | null; 
  onProgramSelect: (program: Program | null) => void;
  programs: Program[];
  programsLoading: boolean;
  programsError: string | null;
}

const ProgramSelection: React.FC<ProgramSelectionProps> = ({
  selectedProgram,
  onProgramSelect,
  programs,
  programsLoading,
  programsError,
}) => {
  const [programInputMethod, setProgramInputMethod] = useState<"dropdown" | "manual" | "all">("dropdown");
  const [allProgramsSelected, setAllProgramsSelected] = useState(false);
  const [manualProgramCode, setManualProgramCode] = useState("");
  
  const [selectedProgramCode, setSelectedProgramCode] = useState<string | null>(selectedProgram ?? null);
  const [manualProgramError, setManualProgramError] = useState<string | null>(null);
  
  const handleProgramInputMethodChange = (
    _event: React.SyntheticEvent, 
    newValue: "dropdown" | "manual" | "all"
  ) => {
    setProgramInputMethod(newValue);
    setManualProgramError(null);
    
    if (newValue === "all") {
      handleSelectAllPrograms();
    } else {
      setAllProgramsSelected(false);
    }
  };
  
  const handleSelectAllPrograms = () => {
    setAllProgramsSelected(true);
    
    if (programs.length > 0) {
      const firstProgram = programs[0];
      setSelectedProgramCode(firstProgram.programId);
      onProgramSelect(firstProgram);
    }
  };
  
  const handleProgramSelect = (programId: string | null) => {
    if (!programId) return;
    
    setSelectedProgramCode(programId);
    const program = programs.find((p) => p.programId === programId);
    if (program) {
      onProgramSelect(program);
    }
  };
  
  const handleManualProgramInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualProgramCode(event.target.value);
    setManualProgramError(null);
  };
  
  const handleManualProgramSubmit = (
    event: React.KeyboardEvent<HTMLInputElement> | null = null
  ) => {
    if (event && event.key !== "Enter") return;
    
    const programId = manualProgramCode.trim();
    if (!programId) return;
    
    const program = programs.find((p) => p.programId === programId);
    if (!program) {
      setManualProgramError(`Program code "${programId}" not found in the list`);
      return;
    }
    
    setSelectedProgramCode(programId);
    onProgramSelect(program);
    setManualProgramError(null);
    setManualProgramCode("");
  };
  
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "20px",
          color: "#000000",
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
          "& .MuiTab-root": {
            color: "#000000",
            fontWeight: 500
          }
        }}
      >
        <Tab value="dropdown" label="Select from List" />
        <Tab value="manual" label="Manual Entry" />
        <Tab value="all" label="Select All" />
      </Tabs>
      
      {programInputMethod === "dropdown" && (
        <Autocomplete
          options={programs.map((p) => p.programId)}
          getOptionLabel={(option) => {
            const prog = programs.find((p) => p.programId === option);
            return prog ? `${option} ${prog.title ?? ""}` : option;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a program"
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                sx: { color: "#000000" },
                endAdornment: (
                  <>
                    {programsLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          onChange={(_, value) => handleProgramSelect(value)}
          value={selectedProgramCode}
          loading={programsLoading}
          sx={{ width: "610px", mb: 2 }}
        />
      )}
      
      {programInputMethod === "manual" && (
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
          
          {manualProgramError && (
            <Alert severity="error" sx={{ width: "610px", mb: 2 }}>
              {manualProgramError}
            </Alert>
          )}
        </Box>
      )}
      
      {programInputMethod === "all" && (
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
            `All programs are selected. Using ${
              programs[0]?.title || "first program"
            } for processing.`
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
            const program = programs.find(p => p.programId === selectedProgramCode);
            if (program) {
              return (
                <Box>
                  <Chips
                    key={program.programId}
                    label={`${program.programId} - ${program.title ?? ""}`}
                    onDelete={() => {
                      setSelectedProgramCode(null);
                      onProgramSelect(null);
                    }}
                    customColor="rgba(54, 124, 255, 0.2)"
                    customTextColor="#292A2E"
                    customHoverColor="rgba(54, 124, 255, 0.4)"
                    showDeleteOnlyOnHover
                  />
                </Box>
              );
            }
            return null;
          })()}
        </Box>
      )}
    </Box>
  );
};

export default ProgramSelection;
