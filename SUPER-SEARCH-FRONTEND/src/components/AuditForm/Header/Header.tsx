import React, { useState } from "react";
import { Typography, Button, Menu, MenuItem } from "@mui/material";
import { getUserInfo } from "../../../services/apiService";

const Header: React.FC = () => {
  const userInfo = getUserInfo();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userExp");
    localStorage.removeItem("userToken");
    

    window.location.reload();
  };


  const getInitials = () => {
    if (!userInfo.name) return "U";
    
    return userInfo.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-white shadow">
      <div className="px-6 py-4 flex justify-between items-center">

        
        {userInfo.isAuthenticated && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleClick}
              sx={{ textTransform: "none" }}
              startIcon={
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {getInitials()}
                </div>
              }
            >
              {userInfo.name}
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ mt: 1 }}
            >
              <MenuItem disabled>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {userInfo.email}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;