import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "../../contexts/ThemeContext";
import { Tooltip } from "@mui/material";

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  disabled = false,
  label = "Add",
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title={label} placement="top">
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
        <AddIcon />
      </Button>
    </Tooltip>
  );
};

export default AddButton;