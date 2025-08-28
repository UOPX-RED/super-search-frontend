import { useState } from 'react';
import axios from 'axios';

interface CourseDetails {
  id: string;
  code: string;
  title: string;
  courseDescription: string;
  outlineBody: string;
}

export const useCourseInfo = () => {
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  //  || "http://localhost:8000";

  const getCourseDetails = async (courseCode: string): Promise<string> => {
    try {
      setLoading(true);
      const url = `${backendUrl}/api/course-details?courseCode=${courseCode}`;
      const response = await axios.get(url);
      const courseDetails = Array.isArray(response.data) ? response.data[0] : response.data;
      
      setCourseData(courseDetails);
      setError(null);
      
      let combinedText = '';
      
      if (courseDetails?.title) {
        combinedText += courseDetails.title + ' ';
      }
      
      if (courseDetails?.courseDescription) {
        combinedText += courseDetails.courseDescription + ' ';
      }
      
      if (courseDetails.outlineBody) {
        combinedText += courseDetails.outlineBody;
      }
      
      return combinedText;
    } catch (err) {
      console.error(`Error fetching details for course ${courseCode}:`, err);
      setError(`Failed to fetch details for course ${courseCode}`);
      throw new Error(`Failed to fetch details for course ${courseCode}`);
    } finally {
      setLoading(false);
    }
  };

  return { courseData, loading, error, getCourseDetails };
};