import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";

function Loading() {
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress
        sx={{
          color: 'primary.main',
          thickness: 5,
          size: 60,
          animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
    </Box>
  );
}

export default Loading;