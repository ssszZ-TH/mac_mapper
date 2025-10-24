import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import MenuItem from "@mui/material/MenuItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";
import { useTheme } from "../contexts/ThemeContext";

interface ResponsiveAppBarProps {
  title: string;
}

// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: theme.shadows[4],
  color: theme.palette.primary.contrastText,
}));


function ResponsiveAppBar({ title }: ResponsiveAppBarProps) {
  const { isDarkMode } = useTheme();
  const [titleText] = React.useState<string>(title || "...");

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="go back"
            onClick={handleGoHome}
            sx={{ 
              mr: 1,
              "&:hover": { 
                backgroundColor: 'action.hover',
                transform: "scale(1.1)",
                transition: "all 0.2s ease-in-out"
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: 'fontFamily',
              fontWeight: 600,
              letterSpacing: ".1rem",
              color: 'text.primary',
              justifyContent: "center",
              ml: -5
            }}
          >
            {titleText}
          </Typography>

          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontFamily: 'fontFamily',
              fontWeight: 600,
              letterSpacing: ".1rem",
              color: 'text.primary',
              justifyContent: "center"
            }}
          >
            {titleText}
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}

export default ResponsiveAppBar;