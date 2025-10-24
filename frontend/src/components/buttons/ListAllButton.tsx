import React from 'react';
import { Button, Tooltip } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import { useTheme } from '../../contexts/ThemeContext';

interface ListAllButtonProps {
  onClick: () => void;
}

export default function ListAllButton({ onClick }: ListAllButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="All" placement="top">
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          margin: '4px',
          textTransform: 'none',
          borderRadius: 'shape.borderRadius',
          minWidth: 'auto',
          padding: '6px',
          height: '36px',
        }}
      >
        <ListIcon />
      </Button>
    </Tooltip>
  );
}