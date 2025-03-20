import { useState, useEffect } from 'react';
import axios from 'axios';

interface Program {
  id: string;
  code: string;
  title: string;
  collegeCode: string;
  collegeName: string;
  levelCode: string;
  levelName: string;
  isActive: boolean;
}


export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/programs`);
        console.log('Programs data:', response.data);
        
        const programsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.programs || response.data.items || [];
        
        setPrograms(programsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to fetch programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [backendUrl]);

  const getProgramByCode = (programCode: string): Program | undefined => {
    return programs.find(program => program.code === programCode);
  };

  return { programs, loading, error, getProgramByCode };
};