import React from 'react';
import { Button, Tooltip } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { useTheme } from '../../contexts/ThemeContext';

interface ListInboxButtonProps {
  onClick: () => void;
}

export default function ListInboxButton({ onClick }: ListInboxButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Inbox" placement="top">
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
        <InboxIcon />
      </Button>
    </Tooltip>
  );
}