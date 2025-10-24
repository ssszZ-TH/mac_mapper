import React from 'react';
import { Button, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '../../contexts/ThemeContext';

interface ListSentButtonProps {
  onClick: () => void;
}

export default function ListSentButton({ onClick }: ListSentButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Sent" placement="top">
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
        <SendIcon />
      </Button>
    </Tooltip>
  );
}