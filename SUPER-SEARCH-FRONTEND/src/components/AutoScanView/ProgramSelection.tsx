/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import Chips from "../ChipTabs/chiptabs";
import { useProgramDetails, ProgramDetailResponse } from "../../hooks/useProgramDetails";

interface Program {
  code: string;
  title: string;
  collegeName: string;
  levelName: string;
  isActive: boolean;
}

interface ProgramSelectionProps {
  selectedProgram?: string | null; 
  onProgramSelect: (program: Program | null) => void;
  programs: any[];
  programsLoading: boolean;
  programsError: string | null;
  selectedPrograms: string[];
  onProgramSelection: (programId: string) => void;
  onProgramContentFetched: (content: ProgramDetailResponse, programId: string) => void;
}

const ProgramSelection: React.FC<ProgramSelectionProps> = ({
  selectedProgram,
  onProgramSelect,
  programs,
  programsLoading,
  programsError,
  selectedPrograms,
  onProgramSelection,
  onProgramContentFetched,
}) => {
  const [programInputMethod, setProgramInputMethod] = useState<"dropdown" | "manual" | "all">("dropdown");
  const [allProgramsSelected, setAllProgramsSelected] = useState(false);
  const [manualProgramCode, setManualProgramCode] = useState("");
  const [selectedProgramCode, setSelectedProgramCode] = useState<string | null>(selectedProgram ?? null);
  const [manualProgramError, setManualProgramError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { getProgramDetails } = useProgramDetails();

  const handleProgramInputMethodChange = (
    _event: React.SyntheticEvent, 
    newValue: "dropdown" | "manual" | "all"
  ) => {
    setProgramInputMethod(newValue);
    setManualProgramError(null);
    
    if (newValue === "all") {
      if (programs.length > 20) {
        setConfirmDialogOpen(true);
      } else {
        handleSelectAllPrograms();
      }
    } else {
      setAllProgramsSelected(false);
    }
  };

  const handleSelectAllPrograms = () => {
    setAllProgramsSelected(true);
    
    programs.forEach((program) => {
      const programId = program.programId || program.code;
      
      if (!selectedPrograms.includes(programId)) {
        onProgramSelection(programId);
        
        getProgramDetails(programId)
          .then((detailsArray) => {
            if (detailsArray.length > 0) {
              const latestVersion = detailsArray.sort((a, b) => {
                const dateA = new Date(a.versionEffectiveDate).getTime();
                const dateB = new Date(b.versionEffectiveDate).getTime();
                return dateB - dateA;
              })[0];
              
              onProgramContentFetched(latestVersion, programId);
            }
          })
          .catch((error) => {
            console.error(`Error fetching details for ${programId}:`, error);
          });
      }
    });
    
    if (programs.length > 0) {
      const firstProgram = programs[0];
      const programId = firstProgram.programId || firstProgram.code;
      setSelectedProgramCode(programId);
      
      const programToSelect: Program = {
        code: firstProgram.programId || firstProgram.code,
        title: firstProgram.title || "",
        collegeName: firstProgram.collegeName || "",
        levelName: firstProgram.levelName || "",
        isActive: firstProgram.isActive !== undefined ? firstProgram.isActive : true
      };
      
      onProgramSelect(programToSelect);
    }
  };

  const handleConfirmSelectAll = () => {
    setConfirmDialogOpen(false);
    handleSelectAllPrograms();
  };

  const handleDeclineSelectAll = () => {
    setConfirmDialogOpen(false);
    setProgramInputMethod("dropdown");
  };

  const handleProgramSelect = (programId: string | null) => {
    if (!programId) return;
    
    setSelectedProgramCode(programId);
    const program = programs.find((p) => (p.programId || p.code) === programId);
    
    if (program) {
      const programToSelect: Program = {
        code: program.programId || program.code,
        title: program.title || "",
        collegeName: program.collegeName || "",
        levelName: program.levelName || "",
        isActive: program.isActive !== undefined ? program.isActive : true
      };
      
      onProgramSelect(programToSelect);
      onProgramSelection(programId);
      
      getProgramDetails(programId)
        .then((detailsArray) => {
          if (detailsArray.length > 0) {
            const latestVersion = detailsArray.sort((a, b) => {
              const dateA = new Date(a.versionEffectiveDate).getTime();
              const dateB = new Date(b.versionEffectiveDate).getTime();
              return dateB - dateA;
            })[0];
            
            onProgramContentFetched(latestVersion, programId);
          }
        })
        .catch((error) => {
          console.error(`Error fetching details for ${programId}:`, error);
        });
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
    
    const program = programs.find((p) => (p.programId || p.code) === programId);
    if (!program) {
      setManualProgramError(`Program code "${programId}" not found in the list`);
      return;
    }
    
    setSelectedProgramCode(programId);
    onProgramSelect(program);
    onProgramSelection(programId);
    
    getProgramDetails(programId)
      .then((detailsArray) => {
        if (detailsArray.length > 0) {
          const latestVersion = detailsArray.sort((a, b) => {
            const dateA = new Date(a.versionEffectiveDate).getTime();
            const dateB = new Date(b.versionEffectiveDate).getTime();
            return dateB - dateA;
          })[0];
          
          onProgramContentFetched(latestVersion, programId);
          setManualProgramError(null);
        } else {
          setManualProgramError(`No details found for program "${programId}"`);
        }
      })
      .catch((error) => {
        console.error(`Error fetching details for ${programId}:`, error);
        setManualProgramError(`Error fetching details for program "${programId}"`);
      });
    
    setManualProgramCode("");
  };

  const programOptions = programs.map((p) => p.programId || p.code).filter((id, index, self) => 
    self.indexOf(id) === index
  );

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
          options={programOptions}
          getOptionLabel={(option) => {
            const prog = programs.find((p) => (p.programId || p.code) === option);
            return prog ? `${option} ${prog.title || ""}` : option;
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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleManualProgramSubmit(e)}
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
      
      {!allProgramsSelected && selectedPrograms.length > 0 && (
        <Box mt="18px">
          <Typography variant="body1" sx={{ mb: "20px", color: "#000000" }}>
            Selected Programs ({selectedPrograms.length})
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {selectedPrograms.map((programId) => {
              const program = programs.find((p) => (p.programId || p.code) === programId);
              const label =
                program && program.title
                  ? `${programId} - ${
                      program.title.length > 20
                        ? program.title.substring(0, 20) + "..."
                        : program.title
                    }`
                  : programId;
              
              return (
                <Chips
                  key={programId}
                  label={label}
                  onDelete={() => onProgramSelection(programId)}
                  customColor="rgba(54, 124, 255, 0.2)"
                  customTextColor="#292A2E"
                  customHoverColor="rgba(54, 124, 255, 0.4)"
                  showDeleteOnlyOnHover
                />
              );
            })}
          </Box>
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

export default ProgramSelection;
