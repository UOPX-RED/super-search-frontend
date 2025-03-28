import { useState } from 'react';
import axios from 'axios';

export interface ProgramDetailResponse {
  id: string;
  programId: string;
  version: string;
  displayName: string;
  textDescription: string;
  formattedDescription: string;
  collegeName: string;
  collegeDepartment: string;
  programLevel: string;
  programLevelDescription: string;
  versionEffectiveDate: string;
  versionExpirationDate: string;
}

export const useProgramDetails = () => {
  const [programData, setProgramData] = useState<ProgramDetailResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const getProgramDetails = async (programId: string): Promise<ProgramDetailResponse[]> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const url = `${backendUrl}/api/programs-details?programId=${programId}`;
      const response = await axios.get(url, {
        headers: token ? { "X-Azure-Token": token } : {}
      });
      console.log('Program details:', response.data);
      
      setProgramData(response.data);
      setError(null);
      
      const sortedData = response.data.sort((a: ProgramDetailResponse, b: ProgramDetailResponse) => {
        return parseInt(b.version) - parseInt(a.version);
      });
      
      return sortedData;
    } catch (err) {
      console.error(`Error fetching details for program ${programId}:`, err);
      setError(`Failed to fetch details for program ${programId}`);
      throw new Error(`Failed to fetch details for program ${programId}`);
    } finally {
      setLoading(false);
    }
  };

  return { programData, loading, error, getProgramDetails };
};
