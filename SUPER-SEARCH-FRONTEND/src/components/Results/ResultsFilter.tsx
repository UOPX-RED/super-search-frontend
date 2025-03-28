import React from 'react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsFilterProps {
  filterText: string;
  setFilterText: (text: string) => void;
  showMatchedOnly: boolean;
  setShowMatchedOnly: (show: boolean) => void;
  handleExportCSV: () => void;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({
  filterText,
  setFilterText,
  showMatchedOnly,
  setShowMatchedOnly,
  handleExportCSV
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col">
        <Input
          placeholder="Filter results..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-247 mb-5"
        />

        <div className="flex items-center space-x-3">
          <div 
            onClick={() => setShowMatchedOnly(!showMatchedOnly)}
            className="relative inline-block w-10 h-5 rounded-full cursor-pointer"
          >
            <div 
              className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                showMatchedOnly ? 'bg-green-500' : 'bg-gray-300'
              }`}
            ></div>
            <div 
              className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                showMatchedOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </div>
          
          <label 
            onClick={() => setShowMatchedOnly(!showMatchedOnly)}
            className="text-sm font-medium cursor-pointer"
          >
            Show only matched results
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <Button 
          onClick={handleExportCSV}
          className="app-button bg-primary hover:bg-primary/90 h-9"
          style={{ backgroundColor: "rgb(0, 179, 115)" }}
        >
          Export CSV
        </Button>
        <Button 
          onClick={() => navigate('/')}
          className="app-button flex items-center gap-1"
          style={{ backgroundColor: "rgb(0, 0, 0)" }}
        >
          <Plus className="h-4 w-4" />
          New Audit
        </Button>
      </div>
    </div>
  );
};

export default ResultsFilter;