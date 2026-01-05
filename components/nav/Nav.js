"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Badge,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CompareIcon from "@mui/icons-material/Compare";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import CartContent from "@/components/cartcontent/CartContent";
import ReservationDialog from "./ReservationDialog";
import { useRouter } from "next/navigation";
//import { useSession } from "next-auth/react";
// import { useSelector } from "react-redux";



import Notification from "@/components/nav/notification/NotificationPanel";
const session = null; // privremeno: user NIJE ulogovan
const Nav = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
 // const { data: session } = useSession();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

// const cartCount = useSelector((state) => state.cart.items?.length || 0);
const cartCount = 0; // privremeno

  const handleAuthIconClick = () => {
    if (session && session?.user) {
      router.push(`/dashboard/${session?.user?.role}`);
    } else {
      router.push("/login");
    }
  };

  const toggleMobileDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMobileDrawerOpen(open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleCartDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setCartDrawerOpen(open);
  };

  const handleReservationOpen = () => {
    setReservationOpen(true);
  };

  const handleReservationClose = () => {
    setReservationOpen(false);
  };

  const handleReservationSubmit = (formData) => {
    console.log(formData);
  };

  const menuItems = (
    <>
      <Link href="/" passHref>
        <Button
          sx={{ color: "black", fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
        >
          Home
        </Button>
      </Link>
      <Link href="/about" passHref>
        <Button
          sx={{ color: "black", fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
        >
          About
        </Button>
      </Link>
      <Link href="/contact" passHref>
        <Button
          sx={{ color: "black", fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
        >
          Contact
        </Button>
      </Link>

      <Button
        sx={{ color: "black", fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Pages
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Link href="/about" passHref>
            About
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/services" passHref>
            Services
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/contact" passHref>
            Contact
          </Link>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <Link href="/term" passHref>
            Term
          </Link>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <Link href="/privacy" passHref>
            Privacy
          </Link>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        boxShadow: 3,
        padding: isSmallScreen ? "0.5rem 0" : "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          maxWidth: "1400px",
          margin: "0 auto",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        {/* Logo and Mobile Menu Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: isSmallScreen ? "100%" : "auto",
            justifyContent: isSmallScreen ? "space-between" : "flex-start",
            marginBottom: isSmallScreen ? "1rem" : 0,
          }}
        >
          {isSmallScreen &&
            !window.location.pathname.includes("/dashboard/admin") && (
              <IconButton onClick={toggleMobileDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
          <Typography
            variant="h6"
            onClick={() => router.push("/")}
            sx={{
              color: "black",
              fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
              fontWeight: "bold",
              cursor: "pointer", // Makes it obvious it's clickable
            }}
          >
            Food Hub
          </Typography>
        </Box>

        {/* Desktop Menu */}
        {!isSmallScreen && (
          <Box sx={{ display: "flex", alignItems: "center" }}>{menuItems}</Box>
        )}

        {/* Icons and Reservation Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isSmallScreen ? "space-between" : "flex-end",
            width: isSmallScreen ? "100%" : "auto",
            marginTop: isSmallScreen ? "1rem" : 0,
          }}
        >
          <IconButton
            onClick={toggleCartDrawer(true)}
            sx={{
              color: "red",
              marginRight: "0.5rem",
              "&:hover": {
                backgroundColor: "#e60000",

                color: "white",
              },
            }}
          >
            <Badge
              badgeContent={cartCount}
              overlap="rectangular"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#ff1a1a", // Bright red
                  color: "white",
                  fontSize: "0.8rem",
                  minWidth: "20px",
                  height: "20px",
                  boxShadow: "0 0 0 2px white", // subtle outline for visibility
                },
              }}
            >
              <ShoppingCartIcon fontSize={isSmallScreen ? "small" : "medium"} />
            </Badge>
          </IconButton>

          <IconButton
            sx={{
              color: "red",
              marginRight: "0.5rem",
              "&:hover": { backgroundColor: "#e60000", color: "white" },
            }}
          >
            <CompareIcon fontSize={isSmallScreen ? "small" : "medium"} />
          </IconButton>
          <IconButton
            onClick={handleAuthIconClick}
            sx={{
              color: "red",
              marginRight: isSmallScreen ? 0 : "0.5rem",
              "&:hover": { backgroundColor: "#e60000", color: "white" },
            }}
          >
            {session?.user ? (
              session.user.image ? (
                <Avatar
                  src={session.user.image}
                  alt="User profile"
                  sx={{
                    width: isSmallScreen ? 24 : 32,
                    height: isSmallScreen ? 24 : 32,
                  }}
                />
              ) : (
                <PersonIcon fontSize={isSmallScreen ? "small" : "medium"} />
              )
            ) : (
              <LoginIcon fontSize={isSmallScreen ? "small" : "medium"} />
            )}
          </IconButton>

          <Notification />

          <Button
            variant="contained"
            onClick={handleReservationOpen}
            sx={{
              backgroundColor: "#e60000",
              color: "white",
              borderRadius: "22px",
              padding: isSmallScreen ? "0.3rem 0.8rem" : "0.5rem 1.5rem",
              fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
              "&:hover": { backgroundColor: "#e60000" },
              display: isSmallScreen ? "none" : "inline-flex",
            }}
          >
            Reservation
          </Button>
          {isSmallScreen && (
            <Button
              variant="contained"
              onClick={handleReservationOpen}
              sx={{
                backgroundColor: "#e60000",
                color: "white",
                borderRadius: "22px",
                padding: "0.3rem 0.8rem",
                fontSize: "0.7rem",
                "&:hover": { backgroundColor: "#e60000" },
              }}
            >
              Reserve
            </Button>
          )}
        </Box>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileDrawer(false)}
          onKeyDown={toggleMobileDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemText>
                <Link href="/" passHref>
                  Home
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="/about" passHref>
                  About
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="/contact" passHref>
                  Contact
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="/test" passHref>
                  Test
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={toggleCartDrawer(false)}
      >
        <Box
          sx={{ width: 500 }}
          role="presentation"
          onClick={toggleCartDrawer(false)}
          onKeyDown={toggleCartDrawer(false)}
        >
          <CartContent />
        </Box>
      </Drawer>

      {/* Reservation Dialog */}
      <ReservationDialog
        open={reservationOpen}
        onClose={handleReservationClose}
        onSubmit={handleReservationSubmit}
      />
    </Box>
  );
};

export default Nav;
