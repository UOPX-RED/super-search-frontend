import React, { useState, useEffect } from "react";
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
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import Chips from "../ChipTabs/chiptabs";
import { useAllCourses } from '../../hooks/useAllCourses';
import { useCourseInfo } from '../../hooks/useCourseInfo';
import { usePrograms } from '../../hooks/usePrograms';

interface Program {
  code: string;
  title: string;
  collegeName: string;
  levelName: string;
  isActive: boolean;
}

interface AutoScanViewProps {
  selectedCourses: string[];
  onSelectCourse: (course: string) => void;
  onCourseContentFetched: (content: string, courseCode: string) => void;
  selectedProgram?: string | null;
  onProgramSelect?: (program: Program | null) => void;
}

const AutoScanView: React.FC<AutoScanViewProps> = ({
  selectedCourses,
  onSelectCourse,
  onCourseContentFetched,
  selectedProgram,
  onProgramSelect = () => {},
}) => {
  const [sourceType, setSourceType] = useState<'course' | 'program'>('course');
  
  const [courseInputMethod, setCourseInputMethod] = useState<'dropdown' | 'manual' | 'all'>('dropdown');
  const [programInputMethod, setProgramInputMethod] = useState<'dropdown' | 'manual' | 'all'>('dropdown');
  
  const [allCoursesSelected, setAllCoursesSelected] = useState(false);
  const [allProgramsSelected, setAllProgramsSelected] = useState(false);
  
  const [manualCourseCode, setManualCourseCode] = useState("");
  const [manualProgramCode, setManualProgramCode] = useState("");
  
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [selectedProgramCode, setSelectedProgramCode] = useState<string | null>(selectedProgram);
  
  const [manualCourseError, setManualCourseError] = useState<string | null>(null);
  const [manualProgramError, setManualProgramError] = useState<string | null>(null);
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const { courses, loading: coursesLoading, error: coursesError } = useAllCourses();
  const { programs, loading: programsLoading, error: programsError } = usePrograms();
  const { getCourseDetails } = useCourseInfo();
  
  const handleSourceTypeChange = (_event: React.SyntheticEvent, newValue: 'course' | 'program') => {
    setSourceType(newValue);
  };
  
  const handleCourseInputMethodChange = (_event: React.SyntheticEvent, newValue: 'dropdown' | 'manual' | 'all') => {
    setCourseInputMethod(newValue);
    setManualCourseError(null);
    
    if (newValue === 'all') {
      if (courses.length > 20) {
        setConfirmDialogOpen(true);
      } else {
        handleSelectAllCourses();
      }
    } else {
      setAllCoursesSelected(false);
    }
  };
  
  const handleProgramInputMethodChange = (_event: React.SyntheticEvent, newValue: 'dropdown' | 'manual' | 'all') => {
    setProgramInputMethod(newValue);
    setManualProgramError(null);
    
    if (newValue === 'all') {
      handleSelectAllPrograms();
    } else {
      setAllProgramsSelected(false);
    }
  };
  
  const handleConfirmSelectAll = () => {
    setConfirmDialogOpen(false);
    handleSelectAllCourses();
  };
  
  const handleDeclineSelectAll = () => {
    setConfirmDialogOpen(false);
    setCourseInputMethod('dropdown');
  };
  
  const handleSelectAllCourses = () => {
    if (courses.length > 20) {
      const confirmAll = window.confirm(`Are you sure you want to select all ${courses.length} courses? This might take a while to process.`);
      if (!confirmAll) {
        setCourseInputMethod('dropdown');
        return;
      }
    }
    
    setAllCoursesSelected(true);
    
    const firstFewCourses = courses.slice(0, 5);
    
    firstFewCourses.forEach(course => {
      if (!selectedCourses.includes(course.code)) {
        onSelectCourse(course.code);
        
        getCourseDetails(course.code)
          .then(content => {
            onCourseContentFetched(content, course.code);
          })
          .catch(error => {
            console.error(`Error fetching content for ${course.code}:`, error);
          });
      }
    });
  };
  
  const handleSelectAllPrograms = () => {
    if (programs.length > 20) {
      const confirmAll = window.confirm(`Are you sure you want to select all ${programs.length} programs? This might take a while to process.`);
      if (!confirmAll) {
        setProgramInputMethod('dropdown');
        return;
      }
    }
    
    setAllProgramsSelected(true);
    
    if (programs.length > 0) {
      const firstProgram = programs[0];
      setSelectedProgramCode(firstProgram.code);
      onProgramSelect(firstProgram);
    }
  };
  
  const handleCourseSelect = (courseCode: string | null) => {
    if (!courseCode) return;
    
    setSelectedCourseCode(courseCode);
    onSelectCourse(courseCode);
    
    getCourseDetails(courseCode)
      .then(content => {
        console.log(`Content fetched for ${courseCode}:`, content.substring(0, 100) + '...');
        onCourseContentFetched(content, courseCode);
      })
      .catch(error => {
        console.error(`Error processing course ${courseCode}:`, error);
      });
  };
  
  const handleProgramSelect = (programCode: string | null) => {
    if (!programCode) return;
    
    setSelectedProgramCode(programCode);
    
    const program = programs.find(p => p.code === programCode);
    if (program) {
      onProgramSelect(program);
    }
  };
  
  const handleManualCourseInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualCourseCode(event.target.value);
    setManualCourseError(null);
  };
  
  const handleManualProgramInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualProgramCode(event.target.value);
    setManualProgramError(null);
  };
  
  const handleManualCourseSubmit = (event: React.KeyboardEvent<HTMLInputElement> | null = null) => {
    if (event && event.key !== "Enter") return;
    
    const courseCode = manualCourseCode.trim();
    if (!courseCode) return;
    
    const courseExists = courses.some(course => course.code === courseCode);
    if (!courseExists) {
      setManualCourseError(`Course code "${courseCode}" not found in the list`);
      return;
    }
    
    onSelectCourse(courseCode);
    
    getCourseDetails(courseCode)
      .then(content => {
        onCourseContentFetched(content, courseCode);
        setManualCourseError(null);
      })
      .catch(error => {
        console.error(`Error processing course ${courseCode}:`, error);
        setManualCourseError(`Error fetching details for course "${courseCode}"`);
      });
      
    setManualCourseCode("");
  };
  
  const handleManualProgramSubmit = (event: React.KeyboardEvent<HTMLInputElement> | null = null) => {
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
    <Box mt={2}>
      <Box mb={3}>
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
          Select Source Type
        </Typography>
        
        <Tabs 
          value={sourceType} 
          onChange={handleSourceTypeChange}
          sx={{ 
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
          <Tab value="course" label="Courses"/>
          <Tab value="program" label="Programs" />
        </Tabs>
      </Box>
      
      {/* COURSE SELECTION */}
      {sourceType === 'course' && (
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
            Course Selection
          </Typography>
          
          <Tabs 
            value={courseInputMethod} 
            onChange={handleCourseInputMethodChange}
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                color: '#000000',
                fontWeight: 500
              }
            }}
          >
            <Tab value="dropdown" label="Select from List"/>
            <Tab value="manual" label="Manual Entry" />
            <Tab value="all" label="Select All" />
          </Tabs>
          
          {courseInputMethod === 'dropdown' && (
            <Autocomplete
              options={courses.map(course => course.code)}
              getOptionLabel={(option) => {
                const course = courses.find(c => c.code === option);
                return course ? `${option} - ${course.title}` : option;
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select a course" 
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    sx: { color: '#000000' },
                    endAdornment: (
                      <React.Fragment>
                        {coursesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              onChange={(_, value) => handleCourseSelect(value)}
              value={selectedCourseCode}
              loading={coursesLoading}
              sx={{ width: "610px", mb: 2 }}
            />
          )}
          
          {courseInputMethod === 'manual' && (
            <Box>
              <TextField
                label="Enter course code"
                placeholder="Example: ACC/421T"
                value={manualCourseCode}
                onChange={handleManualCourseInput}
                onKeyDown={(e) => e.key === "Enter" && handleManualCourseSubmit(e)}
                size="small"
                fullWidth
                error={!!manualCourseError}
                sx={{ width: "610px", mb: manualCourseError ? 1 : 2 }}
                helperText={manualCourseError ? null : "Press Enter to submit"}
              />
              
              {manualCourseError && (
                <Alert severity="error" sx={{ width: "610px", mb: 2 }}>
                  {manualCourseError}
                </Alert>
              )}
            </Box>
          )}
          
          {courseInputMethod === 'all' && (
            <Alert 
              severity={allCoursesSelected ? "success" : "info"} 
              sx={{ width: "610px", mb: 2 }}
            >
              {coursesLoading ? (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading courses...
                </Box>
              ) : allCoursesSelected ? (
                `All ${courses.length} courses are selected and ready for processing.`
              ) : (
                `${courses.length} courses are available to be selected.`
              )}
            </Alert>
          )}
          
          {coursesError && (
            <Alert severity="error" sx={{ width: "610px", mb: 2 }}>
              {coursesError}
            </Alert>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {!allCoursesSelected && selectedCourses.length > 0 && (
            <Box mt="18px">
              <Typography variant="body1" sx={{ mb: "20px", color: "#000000" }}>
                Selected Courses ({selectedCourses.length})
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {selectedCourses.map((course) => (
                  <Chips
                    key={course}
                    label={(() => {
                      const courseObj = courses.find(c => c.code === course);
                      return courseObj ? `${course} - ${courseObj.title.substring(0, 20)}${courseObj.title.length > 20 ? '...' : ''}` : course;
                    })()}
                    onDelete={() => onSelectCourse(course)}
                    customColor="rgba(54, 124, 255, 0.2)"
                    customTextColor="#292A2E"
                    customHoverColor="rgba(54, 124, 255, 0.4)"
                    showDeleteOnlyOnHover
                  />
                ))}
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
              {"Select all courses?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`Are you sure you want to select all ${courses.length} courses? This might take a while to process.`}
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
      )}
      
      {sourceType === 'program' && (
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
              '& .MuiTab-root': {
                color: '#000000',
                fontWeight: 500
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
        </Box>
      )}
    </Box>
  );
};

export default AutoScanView;
