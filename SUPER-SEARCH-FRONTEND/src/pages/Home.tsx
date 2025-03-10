import React from "react";
import { Container, Box, Paper } from "@mui/material";
import AuditForm from "../components/AuditForm/AuditForm";

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        py: 4, 
      }}
    >
      <Container 
        maxWidth="md"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: '900px',
            borderRadius: 2,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            border: '3px solid #e0e0e0',
          }}
        >
          <AuditForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
