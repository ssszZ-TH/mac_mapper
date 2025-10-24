import React, { useContext, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Info as AboutIcon,
  Storage as DatabaseIcon,
  School as TutorialIcon,
} from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import Cookies from 'js-cookie';

const services = [
  {
    title: "Type Management",
    items: [
      { name: "Gender Type", path: "/gender-type" },
      { name: "Communication Event Purpose Type", path: "/communication-event-purpose-type" },
      { name: "Communication Event Status Type", path: "/communication-event-status-type" },
      { name: "Contact Mechanism Type", path: "/contact-mechanism-type" },
      { name: "Country", path: "/country" },
      { name: "Income Range", path: "/income-range" },
      { name: "Industry Type", path: "/industry-type" },
      { name: "Marital Status Type", path: "/marital-status-type" },
      { name: "Organization Type", path: "/organization-type" },
      { name: "Racial Type", path: "/racial-type" },
    ],
  },
];

const navItems = [
  { name: "Profile", icon: <PersonIcon />, path: "/profiles/basetype-admin" },
  { name: "Settings", icon: <SettingsIcon />, path: "/v1/settings" },
  { name: "About", icon: <AboutIcon />, path: "/v1/about" },
  { name: "Database", icon: <DatabaseIcon />, path: "/v1/database" },
  { name: "Tutorial", icon: <TutorialIcon />, path: "/v1/tutorial" },
];

export default function BasetypeAdminHome() {
  const { isAuthenticated, logout, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const renderServiceGrid = (serviceItems: { name: string; path: string }[]) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "flex-start",
      }}
    >
      {serviceItems.map((service) => (
        <Box
          key={service.path}
          component={RouterLink}
          to={service.path}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "110px",
            height: "110px",
            textDecoration: "none",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <Avatar
            src={`/home_thumbnail/${service.name.toLowerCase().replace(/\s+/g, "_")}.png`}
            sx={{
              width: 60,
              height: 60,
              mb: 0.5,
              borderRadius: "10%",
              bgcolor: 'background.paper',
            }}
          />
          <Typography
            variant="body2"
            align="center"
            sx={{
              fontWeight: 500,
              fontSize: "0.75rem",
              lineHeight: 1.2,
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: 'text.primary',
            }}
          >
            {service.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: 'background.default' }}>
      <Box
        sx={{
          width: 240,
          position: "fixed",
          height: "100vh",
          bgcolor: 'primary.main',
          boxShadow: 3,
          zIndex: 10,
        }}
      >
        <Box sx={{ p: 2, textAlign: "center" }}>
          <img
            src="/sphere_wire_frame.svg"
            alt="Logo"
            style={{ width: "100%", objectFit: "contain", filter: isDarkMode ? 'invert(1)' : 'none' }}
          />
        </Box>
        <Divider sx={{ bgcolor: 'text.secondary' }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  "&:hover": { bgcolor: 'action.hover' },
                  color: 'text.primary',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, ml: 30, position: "relative", bgcolor: 'background.default' }}
      >
        <img
          src="/sphere_wire_frame.svg"
          alt="Background"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
            opacity: 0.1,
            filter: isDarkMode ? 'invert(1)' : 'none',
          }}
        />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" sx={{ color: 'text.primary' }} gutterBottom>
                Basetype Admin Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Manage data types such as gender, industry, and income ranges
              </Typography>
            </Box>
            {services.map((section) => (
              <Box key={section.title}>
                {renderServiceGrid(section.items)}
              </Box>
            ))}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}