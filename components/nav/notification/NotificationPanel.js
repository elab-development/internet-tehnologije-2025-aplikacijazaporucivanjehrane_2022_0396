import {
  Box,
  Typography,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";

export default function NotificationPanel() {
  const { data: session } = useSession();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const anchorRef = useRef(null);

  useEffect(() => {
    const pusher = new Pusher(process.env.KEY, {
      cluster: process.env.CLUSTER,
      forceTLS: true,
    });

    const channel = pusher.subscribe("notifications");

    channel.bind("new-notification", (data) => {
      console.log("new-notification", data);

      if (session?.user?.role === "admin") {
        setNotifications((prev) => [data.notification, ...prev]);

        setUnreadCount((prev) => Math.max(0, prev + 1));
      }
    });

    channel.bind("notifications-read", () => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          seen: true,
        }))
      );
      setUnreadCount(0);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user.role]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.API}/notifications`);

      const data = await response.json();

      setNotifications(data);

      setUnreadCount(Math.max(0, data.filter((n) => !n.seen).length));
    } catch (error) {
      console.log("error fetching notivations");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const markNotificationAsRead = async (notification) => {
    try {
      await fetch(`${process.env.API}/notifications/${notification._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, seen: true } : n))
      );

      setUnreadCount(() => Math.max(0, prev - 1));

      if (notification.redirectUrl) {
        router.push(notification.redirectUrl);
      }
    } catch (error) {
      console.log("error marking notifications as read ", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${process.env.API}/notifications/mark-all-read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));

      setUnreadCount(0);

      fetchNotifications();
    } catch (error) {
      console.log("eror marking all as read", error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "just now";

    const date = new Date(dateString);

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} SEC AGO`;

    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min AGO`;

    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours AGO`;

    return `${Math.floor(diffInSeconds / 86400)} Days AGO`;
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {session?.user?.role === "admin" && (
        <IconButton ref={anchorRef} onClick={toggleOpen}>
          <Badge
            badgeContent={unreadCount > 0 ? unreadCount : null}
            color="error"
          >
            <NotificationsIcon sx={{ color: "red" }} />
          </Badge>
        </IconButton>
      )}

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        <Paper
          sx={{
            width: { xs: "90vw", sm: 360 },
            maxHeight: 400,
            overflowY: "auto",
            p: 1,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={1}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={markAllAsRead}
              >
                Mark All As Read
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <List>
            {notifications.length > 0 ? (
              notifications.map((item, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  onClick={() => markNotificationAsRead(item)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: item.seen ? "inherit" : "action.hover",
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.message}
                    secondary={formatTime(item.createdAt)}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: item.seen ? "normal" : "bold",
                    }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            )}
          </List>
          <Divider />
          <Box textAlign="center" py={1}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/notifications")}
            >
              View All Notifications
            </Typography>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
