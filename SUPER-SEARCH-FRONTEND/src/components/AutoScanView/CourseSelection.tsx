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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import Chips from "../ChipTabs/chiptabs";

interface Course {
  code: string;
  title: string;
  collegeName: string;
  courseDescription?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CourseSelectionProps {
  selectedCourses: string[];
  onSelectCourse: (course: string) => void;
  onCourseContentFetched: (content: string, courseCode: string) => void;
  courses: Course[];
  coursesLoading: boolean;
  coursesError: string | null;
  getCourseDetails: (courseCode: string) => Promise<string>;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({
  selectedCourses,
  onSelectCourse,
  onCourseContentFetched,
  courses,
  coursesLoading,
  coursesError,
  getCourseDetails,
}) => {
  const [courseInputMethod, setCourseInputMethod] = useState<"dropdown" | "manual" | "all">("dropdown");
  const [allCoursesSelected, setAllCoursesSelected] = useState(false);
  const [manualCourseCode, setManualCourseCode] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [manualCourseError, setManualCourseError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleCourseInputMethodChange = (
    _event: React.SyntheticEvent, 
    newValue: "dropdown" | "manual" | "all"
  ) => {
    setCourseInputMethod(newValue);
    setManualCourseError(null);
    
    if (newValue === "all") {
      if (courses.length > 20) {
        setConfirmDialogOpen(true);
      } else {
        handleSelectAllCourses();
      }
    } else {
      setAllCoursesSelected(false);
    }
  };
  
  const handleConfirmSelectAll = () => {
    setConfirmDialogOpen(false);
    handleSelectAllCourses();
  };
  
  const handleDeclineSelectAll = () => {
    setConfirmDialogOpen(false);
    setCourseInputMethod("dropdown");
  };
  
  const handleSelectAllCourses = () => {
    setAllCoursesSelected(true);

    courses.forEach((course) => {
      if (!selectedCourses.includes(course.code)) {
        onSelectCourse(course.code);
        getCourseDetails(course.code)
          .then((content) => {
            onCourseContentFetched(content, course.code);
          })
          .catch((error) => {
            console.error(`Error fetching content for ${course.code}:`, error);
          });
      }
    });
  };
  
  const handleCourseSelect = (courseCode: string | null) => {
    if (!courseCode) return;
    setSelectedCourseCode(courseCode);
    onSelectCourse(courseCode);
    
    getCourseDetails(courseCode)
      .then((content) => {
        // console.log(`Content fetched for ${courseCode}:`, content.substring(0, 100) + "...");
        onCourseContentFetched(content, courseCode);
      })
      .catch((error) => {
        console.error(`Error processing course ${courseCode}:`, error);
      });
  };
  
  const handleManualCourseInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualCourseCode(event.target.value);
    setManualCourseError(null);
  };
  
  const handleManualCourseSubmit = (
    event: React.KeyboardEvent<HTMLDivElement | HTMLInputElement> | null = null
  ) => {
    if (event && event.key !== "Enter") return;
    
    const courseCode = manualCourseCode.trim();
    if (!courseCode) return;
    
    const courseExists = courses.some((course) => course.code === courseCode);
    if (!courseExists) {
      setManualCourseError(`Course code "${courseCode}" not found in the list`);
      return;
    }
    
    onSelectCourse(courseCode);
    getCourseDetails(courseCode)
      .then((content) => {
        onCourseContentFetched(content, courseCode);
        setManualCourseError(null);
      })
      .catch((error) => {
        console.error(`Error processing course ${courseCode}:`, error);
        setManualCourseError(`Error fetching details for course "${courseCode}"`);
      });
    setManualCourseCode("");
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
        Course Selection
      </Typography>
      
      <Tabs
        value={courseInputMethod}
        onChange={handleCourseInputMethodChange}
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
      
      {courseInputMethod === "dropdown" && (
        <Autocomplete
          options={courses.map((course) => course.code)}
          getOptionLabel={(option) => {
            const course = courses.find((c) => c.code === option);
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
                sx: { color: "#000000" },
                endAdornment: (
                  <>
                    {coursesLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          onChange={(_, value) => handleCourseSelect(value)}
          value={selectedCourseCode}
          loading={coursesLoading}
          sx={{ width: "610px", mb: 2 }}
        />
      )}
      
      {courseInputMethod === "manual" && (
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
      
      {courseInputMethod === "all" && (
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
            `All ${courses.length} course(s) are selected and ready for processing.`
          ) : (
            `${courses.length} course(s) are available to be selected.`
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
            {selectedCourses.map((course) => {
              const courseObj = courses.find((c) => c.code === course);
              const label = courseObj
                ? `${course} - ${
                    courseObj.title.length > 20
                      ? courseObj.title.substring(0, 20) + "..."
                      : courseObj.title
                  }`
                : course;
              
              return (
                <Chips
                  key={course}
                  label={label}
                  onDelete={() => onSelectCourse(course)}
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
  );
};

export default CourseSelection;