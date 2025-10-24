import React from 'react';
import { Button, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '../../contexts/ThemeContext';

interface ListFavoriteButtonProps {
  onClick: () => void;
}

export default function ListFavoriteButton({ onClick }: ListFavoriteButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <Tooltip title="Favorites" placement="top">
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
        <StarIcon />
      </Button>
    </Tooltip>
  );
}