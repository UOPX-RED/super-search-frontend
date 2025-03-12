import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  TextField,
  Select,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Chips from "../ChipTabs/chiptabs";

interface AutoScanViewProps {
  courses: string[];
  selectedCourses: string[];
  onSelectCourse: (course: string) => void;
  onSelectAll: () => void;
}

const AutoScanView: React.FC<AutoScanViewProps> = ({
  courses,
  selectedCourses,
  onSelectCourse,
  onSelectAll,
}) => {
  const handleCourseSelect = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value) {
      onSelectCourse(value);
    }
  };

  const [courseCode, setCourseCode] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourseCode(e.target.value);
    onSelectCourse(courseCode);
  };

  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "24px",
            color: "#3C3C3C",
            mr: 52, 
          }}
        >
          Course Code
        </Typography>
        {/* <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={selectedCourses.length === courses.length && courses.length > 0}
              onChange={onSelectAll}
            />
          }
          label="Select All"
        /> */}
      </Box>

      <FormControl sx={{ width: '610px' }}>
        <TextField
        placeholder={"CMGT/256"}
        value={courseCode}
        onChange={handleChange}
        size="small"
        sx={{ width: '610px' }}
      />
        {/* <Select
          displayEmpty
          onChange={handleCourseSelect}
          value="" 
          size="small"
          sx={{ mb: 1 }}
        >
          <MenuItem value="">
            Select course
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </Select> */}
      </FormControl>

      {selectedCourses.length > 0 && (
        <Box mt="18px">
          <Typography variant="body1" sx={{ mb: "20px" }}>
            Total ({selectedCourses.length})
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {selectedCourses.map((course) => (
              <Chips
                key={course}
                label={course}
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
    </Box>
  );
};

export default AutoScanView;
