/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Tabs,
  Tab,
} from "@mui/material";
import CourseSelection from "./CourseSelection";
import ProgramSelection from "./ProgramSelection";
import { useAllCourses } from "../../hooks/useAllCourses";
import { useCourseInfo } from "../../hooks/useCourseInfo";
import { usePrograms } from "../../hooks/usePrograms";

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
  selectedPrograms?: string[];
  onProgramSelection?: (programId: string) => void;
  onProgramContentFetched?: (content: any, programId: string) => void;
}

const AutoScanView: React.FC<AutoScanViewProps> = ({
  selectedCourses,
  onSelectCourse,
  onCourseContentFetched,
  selectedProgram,
  onProgramSelect = () => {},
  selectedPrograms = [],
  onProgramSelection = () => {},
  onProgramContentFetched = () => {},
}) => {
  const [sourceType, setSourceType] = useState<"course" | "program">("course");
  
  const { courses, loading: coursesLoading, error: coursesError } = useAllCourses();
  const { programs, loading: programsLoading, error: programsError } = usePrograms();
  const { getCourseDetails } = useCourseInfo();
  
  const handleSourceTypeChange = (
    _event: React.SyntheticEvent, 
    newValue: "course" | "program"
  ) => {
    setSourceType(newValue);
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
      
      {sourceType === "course" ? (
        <CourseSelection
          selectedCourses={selectedCourses}
          onSelectCourse={onSelectCourse}
          onCourseContentFetched={onCourseContentFetched}
          courses={courses}
          coursesLoading={coursesLoading}
          coursesError={coursesError}
          getCourseDetails={getCourseDetails}
        />
      ) : (
        <ProgramSelection
          selectedProgram={selectedProgram}
          onProgramSelect={onProgramSelect}
          programs={programs}
          programsLoading={programsLoading}
          programsError={programsError}
          selectedPrograms={selectedPrograms}
          onProgramSelection={onProgramSelection}
          onProgramContentFetched={onProgramContentFetched}
        />
      )}
    </Box>
  );
};

export default AutoScanView;
