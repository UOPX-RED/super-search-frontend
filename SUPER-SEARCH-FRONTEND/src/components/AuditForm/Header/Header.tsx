import React, { useState } from "react";
import { 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider, 
  Box
} from "@mui/material";
import { getUserInfo } from "../../../services/apiService";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-6 py-3 flex justify-between items-center max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-2">
        </div>
        
        {userInfo.isAuthenticated && (
          <div className="flex items-center ml-auto">
            <Button
              onClick={handleClick}
              sx={{ 
                textTransform: "none",
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              <div className="flex items-center gap-2">
                <Avatar
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: "#0CBC8B",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: "#333"
                  }}
                >
                  {userInfo.name}
                </Typography>
              </div>
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ 
                mt: 1,
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: '0px 5px 15px rgba(0,0,0,0.08)',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <PersonIcon sx={{ mr: 1.5, fontSize: 18, color: '#666' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {userInfo.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {userInfo.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              
              <Divider />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  py: 1, 
                  px: 2,
                  color: '#f44336',
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} />
                <Typography variant="body2">
                  Log out
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;