import { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
  id: string;
  code: string;
  title: string;
  collegeName: string;
  departmentName: string;
}

export const useAllCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/templates`);
        console.log('All courses data:', response.data);
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, [backendUrl]);

  return { courses, loading, error };
};