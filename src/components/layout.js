import React from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = ({ setIsLoggedIn }) => { // Tambahkan setIsLoggedIn sebagai prop
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const nim = localStorage.getItem("name") || "Unknown";

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Logbook", icon: <BookIcon />, path: "/dashboard/logbooks" },
  ];

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout
      await axios.post("https://iflab-logbook-backend.onrender.com/logout", {}, {
        withCredentials: true, // Pastikan cookie dikirimkan
      });
  
      localStorage.removeItem("name"); // Hapus data nama atau informasi pengguna lain
    
  
      // Update status login
      setIsLoggedIn(false);
  
      // Redirect ke halaman login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={isDrawerOpen}
        PaperProps={{
          style: { width: "240px", backgroundColor: "#2c3e50", color: "#ecf0f1" },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              style={{
                backgroundColor: isActive(item.path) ? "#34495e" : "transparent",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <ListItemIcon style={{ color: "#ecf0f1" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <div style={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{ zIndex: 1201, backgroundColor: "#ecf0f1", color: "#2c3e50" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Logbook Caslab | SiCaslab 
            </Typography>
            <div>
              <IconButton onClick={handleMenuOpen} disableRipple>
                <Typography style={{ color: "#2c3e50", fontWeight: "bold" }}>{nim}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    backgroundColor: "#ecf0f1",
                    color: "#2c3e50",
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon style={{ marginRight: "10px" }} />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: "64px", padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
