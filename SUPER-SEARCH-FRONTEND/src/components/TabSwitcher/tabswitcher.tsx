import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

interface TabSwitcherMUIProps {
  activeTab: "MANUAL" | "AUTO";
  onChangeTab: (tab: "MANUAL" | "AUTO") => void;
}

const TabSwitcherMUI: React.FC<TabSwitcherMUIProps> = ({ activeTab, onChangeTab }) => {
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onChangeTab(newValue === 0 ? "MANUAL" : "AUTO");
  };

  return (
    <Box mb={2}>
      <Tabs
        value={activeTab === "MANUAL" ? 0 : 1}
        onChange={handleChange}
        textColor="inherit"
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          position: 'relative',
          '& .MuiTab-root': {
            marginRight: '11px',
            '&:last-child': {
              marginRight: 0  
            }
          }
        }}
      >
        <Tab
          label="Manual Input"
          sx={{
            boxSizing: 'border-box',
            width: '320.5px',
            height: '20px',
            backgroundColor: activeTab === "MANUAL" ? "#000000" : "#FFFFFF",
            color: activeTab === "MANUAL" ? "#FFFFFF" : "#000000",
            borderRadius: '5px',
            border: '1px solid #000000',
            fontSize: '20px',
            lineHeight: '24px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: activeTab === "MANUAL" ? "#000000" : "#FFFFFF",
            }
          }}
        />
        <Tab
          label="Auto Scan"
          sx={{
            boxSizing: 'border-box',
            width: '320.5px', 
            height: '20px',
            backgroundColor: activeTab === "AUTO" ? "#000000" : "#FFFFFF",
            color: activeTab === "AUTO" ? "#FFFFFF" : "#000000",
            borderRadius: '5px',
            border: '1px solid #000000',
            fontSize: '20px',
            lineHeight: '24px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: activeTab === "AUTO" ? "#000000" : "#FFFFFF",
            }
          }}
        />
      </Tabs>
    </Box>
  );
};

export default TabSwitcherMUI;
