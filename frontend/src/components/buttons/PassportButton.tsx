import React from "react";
import Button from "@mui/material/Button";
import PassportIcon from "@mui/icons-material/CardTravel";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface PassportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const PassportButton: React.FC<PassportButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Manage passports for this citizenship" placement="top">
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
        <PassportIcon />
        Passport
      </Button>
    </Tooltip>
  );
};

export default PassportButton;