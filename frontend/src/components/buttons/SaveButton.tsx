import React from "react";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Save" placement="top">
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
          borderRadius: 'shape.borderRadius',
        }}
      >
        <SaveIcon />
      </Button>
    </Tooltip>
  );
};

export default SaveButton;