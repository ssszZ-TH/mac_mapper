import React from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Cancel" placement="top">
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: 'error.main',
          color: 'error.contrastText',
          "&:hover": {
            backgroundColor: 'error.dark',
          },
          margin: "4px",
          textTransform: "none",
          borderRadius: 'shape.borderRadius',
        }}
      >
        <CloseIcon />
      </Button>
    </Tooltip>
  );
};

export default CancelButton;