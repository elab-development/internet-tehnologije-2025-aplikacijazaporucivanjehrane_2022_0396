
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { StyledSummaryPaper, StyledTypography, colorful } from "./cartStyles";

const CartSummary = ({
  // Original props
  subtotal: propSubtotal,
  totalDiscount: propTotalDiscount,
  discountType: propDiscountType,
  discountValue: propDiscountValue,
  total: propTotal,
  couponCode: propCouponCode,
  cartItems: propCartItems,
  selectedAddress: propSelectedAddress,
  deliveryFee: propDeliveryFee,
  setCouponCode: propSetCouponCode,
  handleApplyCoupon: propHandleApplyCoupon,
  handleRemoveCoupon: propHandleRemoveCoupon,

  // Context props
  isCheckoutPage = false,
  isPaymentPage = false,
}) => {
  const router = useRouter();
  const [showAddressError, setShowAddressError] = useState(false);

  // 1. Enhanced session data management
  const [checkoutData, setCheckoutData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(sessionStorage.getItem("checkoutData")) || {};
      return {
        cartItems: propCartItems || saved.cartItems || [],
        subtotal: propSubtotal ?? saved.subtotal ?? 0,
        totalDiscount: propTotalDiscount ?? saved.totalDiscount ?? 0,
        discountType: propDiscountType ?? saved.discountType,
        discountValue: propDiscountValue ?? saved.discountValue ?? 0,
        couponCode: propCouponCode ?? saved.couponCode ?? "",
        address: propSelectedAddress ?? saved.address ?? null,
        deliveryFee:
          propDeliveryFee ??
          (saved.address?.delivery_area_id?.delivery_fee || 0) ??
          0,
        total:
          propTotal ??
          (propSubtotal ?? saved.subtotal ?? 0) -
            (propTotalDiscount ?? saved.totalDiscount ?? 0) +
            (propDeliveryFee ??
              (saved.address?.delivery_area_id?.delivery_fee || 0) ??
              0),
      };
    }
    return {
      cartItems: [],
      subtotal: 0,
      totalDiscount: 0,
      discountType: null,
      discountValue: 0,
      couponCode: "",
      address: null,
      deliveryFee: 0,
      total: 0,
    };
  });

  // 2. Proper delivery fee calculation and session storage
  useEffect(() => {
    const deliveryFee =
      checkoutData.address?.delivery_area_id?.delivery_fee || 0;
    const updatedData = {
      ...checkoutData,
      deliveryFee,
      total: checkoutData.subtotal - checkoutData.totalDiscount + deliveryFee,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(updatedData));
    // Only update state if values actually changed to prevent infinite loops
    if (deliveryFee !== checkoutData.deliveryFee) {
      setCheckoutData(updatedData);
    }
  }, [checkoutData.address]);

  // 3. Handle address updates from parent
  useEffect(() => {
    if (propSelectedAddress) {
      const deliveryFee =
        propSelectedAddress.delivery_area_id?.delivery_fee || 0;
      setCheckoutData((prev) => ({
        ...prev,
        address: propSelectedAddress,
        deliveryFee,
        total: prev.subtotal - prev.totalDiscount + deliveryFee,
      }));
    }
  }, [propSelectedAddress]);

  // 4. Original coupon code management
  const handleCouponChange = (e) => {
    const value = e.target.value;
    if (propSetCouponCode) {
      propSetCouponCode(value);
    }
    setCheckoutData((prev) => ({ ...prev, couponCode: value }));
  };

  const applyCoupon = () => {
    if (propHandleApplyCoupon) {
      propHandleApplyCoupon();
    } else {
      // Default coupon handling if no prop provided
      const discountValue = 10; // Example 10% discount
      const totalDiscount = (checkoutData.subtotal * discountValue) / 100;

      setCheckoutData((prev) => ({
        ...prev,
        totalDiscount,
        discountType: "percentage",
        discountValue,
        total: prev.subtotal - totalDiscount + prev.deliveryFee,
      }));
    }
  };

  const removeCoupon = () => {
    if (propHandleRemoveCoupon) {
      propHandleRemoveCoupon();
    } else {
      setCheckoutData((prev) => ({
        ...prev,
        totalDiscount: 0,
        discountType: null,
        discountValue: 0,
        couponCode: "",
        total: prev.subtotal + prev.deliveryFee,
      }));
    }
  };

  // 5. Navigation with validation
  const handleProceed = () => {
    if ((isCheckoutPage || isPaymentPage) && !checkoutData.address) {
      setShowAddressError(true);
      return;
    }

    if (isPaymentPage) {
      console.log("Submitting payment with:", checkoutData);
      // router.push('/order-confirmation');
    } else if (isCheckoutPage) {
      router.push("/payment");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <>
      <StyledSummaryPaper elevation={3}>
        <StyledTypography variant="h5" gutterBottom fontWeight="bold">
          {isPaymentPage
            ? "Payment Summary"
            : isCheckoutPage
            ? "Order Summary"
            : "Cart Summary"}
        </StyledTypography>

        <Box sx={{ mb: 3 }}>
          {/* Original Subtotal Display */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <StyledTypography>Subtotal:</StyledTypography>
            <StyledTypography>
              ${checkoutData.subtotal.toFixed(2)}
            </StyledTypography>
          </Box>

          {/* Enhanced Delivery Fee Display */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <StyledTypography>Delivery:</StyledTypography>
            <StyledTypography>
              ${checkoutData.deliveryFee.toFixed(2)}
              {checkoutData.address?.delivery_area_id && (
                <Chip
                  label={checkoutData.address.delivery_area_id.area_name}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </StyledTypography>
          </Box>

          {/* Original Discount Display */}
          {checkoutData.totalDiscount > 0 ? (
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <StyledTypography>
                Discount{" "}
                {checkoutData.discountType === "percentage"
                  ? `(${checkoutData.discountValue}%)`
                  : ""}
                :
              </StyledTypography>
              <StyledTypography sx={{ color: "#031268ff" }}>
                -${checkoutData.totalDiscount.toFixed(2)}
              </StyledTypography>
            </Box>
          ) : (
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <StyledTypography>Discount:</StyledTypography>
              <StyledTypography sx={{ color: "#a7f3d0" }}>
                $0.00
              </StyledTypography>
            </Box>
          )}

          {/* Original Total Display */}
          <Box display="flex" justifyContent="space-between" mb={3}>
            <StyledTypography variant="h6" fontWeight="bold">
              Total:
            </StyledTypography>
            <StyledTypography variant="h6" fontWeight="bold">
              ${checkoutData.total.toFixed(2)}
            </StyledTypography>
          </Box>
        </Box>

        {/* Original Coupon Section - Only on Cart Page */}
        {!isCheckoutPage && !isPaymentPage && (
          <>
            <TextField
              label="Coupon Code"
              value={propCouponCode}
              onChange={(e) => propSetCouponCode(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={propHandleApplyCoupon}
              disabled={!propCouponCode.trim()}
              sx={{
                mb: 2,
                color: "white",
                background: colorful.warningGradient,
              }}
            >
              Apply Coupon
            </Button>

            {checkoutData.totalDiscount > 0 && (
              <Button
                fullWidth
                sx={{
                  mb: 2,
                  background: colorful.errorGradient,
                  color: "white",
                }}
                onClick={propHandleRemoveCoupon}
              >
                Remove Coupon
              </Button>
            )}
          </>
        )}

        {/* Enhanced Address Display for Checkout/Payment Pages */}
        {(isCheckoutPage || isPaymentPage) && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "1px solid",
              borderColor: checkoutData.address ? colorful.primary : "#eee",
              borderRadius: 1,
              position: "relative",
              backgroundColor: checkoutData.address
                ? "#e6870cff"
                : "background.paper",
            }}
          >
            {checkoutData.address && (
              <CheckCircle
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: colorful.primary,
                  fontSize: "1.5rem",
                }}
              />
            )}

            <Typography variant="subtitle1" gutterBottom>
              Delivery Address
            </Typography>

            {checkoutData.address ? (
              <>
                <Typography fontWeight="500">
                  {checkoutData.address.first_name}{" "}
                  {checkoutData.address.last_name}
                </Typography>
                <Typography>{checkoutData.address.address}</Typography>
                <Typography>
                  {checkoutData.address.city}, {checkoutData.address.state}
                </Typography>
                <Typography>Phone: {checkoutData.address.phone}</Typography>
              </>
            ) : (
              <Typography color="text.secondary">
                No address selected
              </Typography>
            )}
          </Box>
        )}

    

{!isPaymentPage && (
  <Button
    variant="contained"
    fullWidth
    size="large"
    onClick={handleProceed}
    disabled={
      checkoutData.cartItems.length === 0 ||
      (isCheckoutPage && !checkoutData.address)
    }
    sx={{
      mt: 3,
      background: colorful.successGradient,
      "&:hover": {
        background: colorful.successDark,
      },
      "&:disabled": {
        background: "#e0e0e0",
      },
    }}
  >
    {isCheckoutPage ? "Proceed to Payment" : "Proceed to Checkout"}
  </Button>
)}
      </StyledSummaryPaper>

      {/* Address Error Snackbar */}
      <Snackbar
        open={showAddressError}
        autoHideDuration={3000}
        onClose={() => setShowAddressError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setShowAddressError(false)}>
          Please select a delivery address before proceeding.
        </Alert>
      </Snackbar>
    </>
  );
};

export default CartSummary;