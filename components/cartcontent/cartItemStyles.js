// styles/cartItemStyles.js
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';

const itemEnter = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const CartItemWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  animation: `${itemEnter} 0.3s ease-out`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    transform: 'translateX(5px)',
  },
}));

export const ProductImage = styled('img')({
  width: '72px',
  height: '72px',
  borderRadius: '12px',
  objectFit: 'cover',
  marginRight: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
});

export const ProductInfo = styled('div')({
  flexGrow: 1,
  minWidth: 0,
});

export const ProductName = styled(Typography)({
  fontWeight: '600',
  color: '#2d3748',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ProductQuantity = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  '& span': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: '#f56565',
    color: 'white',
    borderRadius: '6px',
    marginLeft: '8px',
    fontSize: '0.75rem',
  },
}));

export const RemoveButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(245, 101, 101, 0.1)',
    transform: 'scale(1.1)',
  },
}));