
"use client";

import React, { useEffect, useState } from "react";
import {
  CartContainer,
  CartTitle,
  ActionButton,
  EmptyCart,
} from "./cartStyles";
import CartItem from "./CartItem";
import { Box, CircularProgress } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Typography from "@mui/material/Typography";

import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "@/slice/cartSlice";

const CartContent = () => {
  const dispatch = useDispatch();

  const {
    items: cartItems,
    loading,
    error,
  } = useSelector((state) => state.cart);

  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Handle item removal with animation state
  const handleRemoveItem = async (id) => {
    try {
      setIsAnimating(true);
      await dispatch(removeFromCart(id)).unwrap(); // unwrap to catch error if needed
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setIsAnimating(false);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.totalPrice, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <CartContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </CartContainer>
    );
  }

  if (error) {
    return (
      <CartContainer>
        <Typography color="error">{error}</Typography>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartTitle variant="h5">Your Shopping Cart</CartTitle>

      {cartItems.length === 0 ? (
        <EmptyCart>
          <ShoppingBagOutlinedIcon
            sx={{ fontSize: 60, color: "text.disabled" }}
          />
          <Typography variant="body1" color="textSecondary">
            Your cart is empty
          </Typography>
        </EmptyCart>
      ) : (
        <>
          <Box sx={{ maxHeight: "400px", overflowY: "auto", mb: 2 }}>
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={{
                  id: item._id,
                  name: item.productId.name,
                  image: item.productId.thumb_image,
                  quantity: item.quantity,
                  price: item.totalPrice / item.quantity,
                  size: item.sizeId?.name,
                  options: item.optionIds?.map((opt) => opt.name).join(", "),
                  totalPrice: item.totalPrice,
                }}
                onRemove={handleRemoveItem}
                isAnimating={isAnimating}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" fontWeight="700">
              ${calculateTotal()}
            </Typography>
          </Box>

          <ActionButton fullWidth href="/cart">
            View Cart
          </ActionButton>
          <ActionButton
            fullWidth
            href="/checkout"
            sx={{
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            Checkout
          </ActionButton>
        </>
      )}
    </CartContainer>
  );
};

export default CartContent;