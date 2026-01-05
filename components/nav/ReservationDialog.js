
"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

const ReservationDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    persons: "1",
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available time slots when dialog opens
  useEffect(() => {
    if (open) {
      fetchTimeSlots();
    }
  }, [open]);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.API}/reservation-times`);
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send data to server
      const response = await fetch(`${process.env.API}/user/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // if (!response.ok) {
      //   throw new Error("Failed to create reservation");
      // }

      const result = await response.json();
      onSubmit(result);
      onClose();

      if (!response.ok) {
        toast.error(result?.err);
      } else {
        toast.success(result?.message);
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  const personOptions = [
    { value: "1", label: "1 Person" },
    { value: "2", label: "2 People" },
    { value: "3", label: "3 People" },
    { value: "4", label: "4 People" },
    { value: "5", label: "5 People" },
    { value: "6", label: "6+ People" },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          mr: 1,
          backgroundColor: "#e60000",
          color: "white",
          "&:hover": {
            backgroundColor: "#e60000",
            color: "white",
          },
        }}
      >
        Book a Table
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the form to book a table.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          type="tel"
          fullWidth
          variant="standard"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="date"
          label="Date"
          type="date"
          fullWidth
          variant="standard"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          margin="dense"
          name="time"
          label="Time Slot"
          select
          fullWidth
          variant="standard"
          value={formData.time}
          onChange={handleChange}
          disabled={loading || timeSlots.length === 0}
          required
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : timeSlots.length > 0 ? (
            timeSlots.map((slot) => (
              <MenuItem key={slot._id} value={slot._id}>
                {`${slot.start_time} - ${slot.end_time}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No available time slots</MenuItem>
          )}
        </TextField>
        <TextField
          margin="dense"
          name="persons"
          label="Number of People"
          select
          fullWidth
          variant="standard"
          value={formData.persons}
          onChange={handleChange}
          required
        >
          {personOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            mr: 1,
            backgroundColor: "#e60000",
            color: "white",
            "&:hover": {
              backgroundColor: "#e60000",
              color: "white",
            },
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            mr: 1,
            backgroundColor: "#e60000",
            color: "white",
            "&:hover": {
              backgroundColor: "#e60000",
              color: "white",
            },
          }}
          disabled={
            loading ||
            !formData.name ||
            !formData.phone ||
            !formData.date ||
            !formData.time
          }
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Book"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;
