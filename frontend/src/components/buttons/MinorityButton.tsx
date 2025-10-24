import React from "react";
import Button from "@mui/material/Button";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface MinorityButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const MinorityButton: React.FC<MinorityButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Manage Minority status for this person" placement="top">
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          "&:hover": {
            backgroundColor: 'primary.dark',
          },
          margin: "4px",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderRadius: 'shape.borderRadius',
        }}
      >
        <Diversity3Icon />
        Minority
      </Button>
    </Tooltip>
  );
};

export default MinorityButton;