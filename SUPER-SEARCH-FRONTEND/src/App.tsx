import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ResultsPage from "./pages/ResultsPage";
import ResultDetailsPage from "./pages/ResultDetailsPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/results/:id" element={<ResultDetailsPage />} />
    </Routes>
  );
};

export default App;
