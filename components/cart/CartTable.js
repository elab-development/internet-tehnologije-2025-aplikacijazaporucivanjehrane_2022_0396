"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import {
  StyledTableContainer,
  StyledTableCell,
  StyledTypography,
  colorful,
} from "./cartStyles";

const CartTable = ({
  cartItems,
  handleQuantityChange,
  handleRemoveItem,
}) => {
  return (
    <StyledTableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Details</StyledTableCell>
            <StyledTableCell>Unit Price</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Total</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.length === 0 ? (
            <TableRow>
              <StyledTableCell colSpan={6} align="center">
                <StyledTypography>Your cart is empty</StyledTypography>
              </StyledTableCell>
            </TableRow>
          ) : (
            cartItems.map((item) => (
              <TableRow key={item._id} hover>
                <StyledTableCell>
                  <Box
                    component="img"
                    src={item.productId?.thumb_image}
                    alt={item.productId?.name}
                    sx={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTypography fontWeight="bold">
                   { item.productId?.name}
                  </StyledTypography>
                  {item.sizeId && (
                    <StyledTypography variant="body2">
                      Size:{item.sizeId.name}
                    </StyledTypography>
                  )}
                  {item.optionIds?.length > 0 && (
                    <StyledTypography variant="body2">
                      Options:{" "}
                    {  item.optionIds.map((opt) => opt.name).join(", ")}
                    </StyledTypography>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  $ { item.productId?.price?.toFixed(2)}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    onClick={() => handleQuantityChange(item._id, -1)}
                  >
                    <Remove />
                  </IconButton>
                  <Box component="span" sx={{ mx: 1, fontWeight: "bold" }}>
                  {  item.quantity}
                  </Box>
                  <IconButton
                    onClick={() => handleQuantityChange(item._id, 1)}
                  >
                    <Add />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell>
                  $  { (item.totalPrice || 0).toFixed(2)}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={() => handleRemoveItem(item._id)}>
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default CartTable;