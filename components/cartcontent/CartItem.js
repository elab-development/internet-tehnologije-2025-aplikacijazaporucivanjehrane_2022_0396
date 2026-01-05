// components/CartItem.js
"use client";

import React from "react";
import {
  CartItemWrapper,
  ProductImage,
  ProductInfo,
 
  ProductName,
  ProductQuantity,
  RemoveButton,
} from "./cartItemStyles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

const CartItem = ({ item, onRemove, isAnimating }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <CartItemWrapper>
        <ProductImage src={item.image} alt={item.name} />
        <ProductInfo>
          <ProductName variant="body1">
           { item.name}
            
            </ProductName>

          {item.size && (
            <Typography variant="body2" color="textSecondary" fontWeight={900}>
              Size: {item.size}
            </Typography>
          )}

          {item.options && (
            <Typography variant="body2" color="textSecondary" fontWeight={900}>
              Options:{ item.options}
            </Typography>
          )}

          <ProductQuantity variant="body2">
            Quantity: <span>{item.quantity}</span>
          </ProductQuantity>

          <Typography variant="body2" color="primary" fontWeight="600">
            $ {item.totalPrice.toFixed(2)}
          </Typography>
        </ProductInfo>

        <RemoveButton
          onClick={() => onRemove(item?.id)}
          aria-label="Remove item"
          disabled={isAnimating}
        >
          <DeleteIcon />
        </RemoveButton>
      </CartItemWrapper>
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)" }} />
    </motion.div>
  );
};

export default CartItem;
