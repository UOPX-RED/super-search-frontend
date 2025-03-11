import React from "react";
import AuditForm from "../components/AuditForm/AuditForm";
import Header from "../components/./AuditForm/Header/Header";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow sm:rounded-lg">
          <AuditForm />
        </div>
      </main>
    </div>
  );
};

export default Home;