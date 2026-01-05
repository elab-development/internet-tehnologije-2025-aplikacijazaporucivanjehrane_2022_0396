// styles/cartStyles.js
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';




const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const CartContainer = styled('div')(({ theme }) => ({
  width: '500px',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  animation: `${fadeIn} 0.3s ease-out`,
}));

export const CartTitle = styled(Typography)({
  marginBottom: '24px',
  fontWeight: '700',
  color: '#2d3748',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: 0,
    width: '50px',
    height: '4px',
    backgroundColor: '#f56565',
    borderRadius: '2px',
  },
});

export const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f56565',
  color: '#fff',
  fontWeight: 600,
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  marginBottom: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#e53e3e',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(245, 101, 101, 0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

export const EmptyCart = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  '& img': {
    width: '120px',
    marginBottom: theme.spacing(2),
    opacity: 0.7,
  },
}));