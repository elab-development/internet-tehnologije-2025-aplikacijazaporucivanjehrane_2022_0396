// cartStyles.js
import { styled } from "@mui/material/styles";
import {
  Container,
  TableCell,
  TableContainer,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1),
  borderRadius: "16px",
  background: "linear-gradient(145deg, #f5f7fa, #e4e8f0)",
  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "400px",
  overflow: "auto",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(10px)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0,0,0,0.05)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledSummaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  background: "linear-gradient(135deg,rgba(224, 186, 186, 1) 0%,rgba(224, 6, 6, 1) 100%)",
  color: "white",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "10px 20px",
  fontWeight: "bold",
    color:"white",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "rgba(255,255,255,0.9)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.5)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.8)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.8)",
  },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "inherit",
}));





export const colorful = {
  primaryGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  secondaryGradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  successGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  errorGradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  warningGradient: "linear-gradient(135deg,rgb(255, 7, 7) 0%, #ff8b07 100%)",
  textPrimary: "#2d3748",
  textSecondary: "#4a5568",
  lightText: "#f8fafc",
};