import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Delete" placement="top">
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
        <DeleteIcon />
      </Button>
    </Tooltip>
  );
};

export default DeleteButton;