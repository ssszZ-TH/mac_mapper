import React from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface UpdateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Edit" placement="top">
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
        <EditIcon />
      </Button>
    </Tooltip>
  );
};

export default UpdateButton;