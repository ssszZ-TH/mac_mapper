import React from "react";
import Button from "@mui/material/Button";
import EqualizerIcon from "@mui/icons-material/Face";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface EeocButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const EeocButton: React.FC<EeocButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Manage EEOC for this person" placement="top">
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
        <EqualizerIcon />
        EEOC
      </Button>
    </Tooltip>
  );
};

export default EeocButton;