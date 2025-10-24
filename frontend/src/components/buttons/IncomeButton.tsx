import React from "react";
import Button from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTheme } from "../../contexts/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

interface IncomeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const IncomeButton: React.FC<IncomeButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Manage income for this person" placement="top">
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
        <AttachMoneyIcon />
        Income
      </Button>
    </Tooltip>
  );
};

export default IncomeButton;