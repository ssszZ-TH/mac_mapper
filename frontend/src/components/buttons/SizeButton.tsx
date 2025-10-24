import React from "react";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface SizeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SizeButton: React.FC<SizeButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Manage Size for this organization" placement="top">
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
        <GroupIcon />
        Size
      </Button>
    </Tooltip>
  );
};

export default SizeButton;