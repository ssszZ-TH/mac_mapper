import { IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

export default function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <IconButton onClick={onClick} color={isFavorite ? 'warning' : 'default'}>
      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
}