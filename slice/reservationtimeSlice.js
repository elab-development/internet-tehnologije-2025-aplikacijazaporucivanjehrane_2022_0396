import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch single reservation time by ID
export const fetchReservationTimeById = createAsyncThunk(
  "reservationTimes/fetchReservationTimeById",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/reservation-times/${id}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch reservation time: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading reservation time: ${error.message}`);
      throw error;
    }
  }
);

// Fetch all reservation times
export const fetchReservationTimes = createAsyncThunk(
  "reservationTimes/fetchReservationTimes",
  async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/reservation-times`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch reservation times: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      toast.error(`Error loading reservation times: ${error.message}`);
      throw error;
    }
  }
);

// Create new reservation time
export const createReservationTime = createAsyncThunk(
  "reservationTimes/createReservationTime",
  async (timeData) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/reservation-times`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeData),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to create reservation time: ${response.status}`
        );
      }
      const data = await response.json();
      toast.success("Reservation time created successfully!");
      return data;
    } catch (error) {
      toast.error(`Error creating reservation time: ${error.message}`);
      throw error;
    }
  }
);

// Update existing reservation time
export const updateReservationTime = createAsyncThunk(
  "reservationTimes/updateReservationTime",
  async ({ id, timeData }) => {
    console.log("{ id, timeData }", { id, timeData });

    try {
      const response = await fetch(
        `${process.env.API}/admin/reservation-times/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeData),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to update reservation time: ${response.status}`
        );
      }
      const data = await response.json();
      toast.success("Reservation time updated successfully!");
      return data;
    } catch (error) {
      toast.error(`Error updating reservation time: ${error.message}`);
      throw error;
    }
  }
);

// Delete reservation time
export const deleteReservationTime = createAsyncThunk(
  "reservationTimes/deleteReservationTime",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/reservation-times/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to delete reservation time: ${response.status}`
        );
      }
      toast.success("Reservation time deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Error deleting reservation time: ${error.message}`);
      throw error;
    }
  }
);

const reservationTimeSlice = createSlice({
  name: "reservationTimes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Reservation Time
      .addCase(createReservationTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservationTime.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createReservationTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Reservation Times
      .addCase(fetchReservationTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReservationTimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Reservation Time
      .addCase(updateReservationTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservationTime.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action payload", action);

        const index = state.list.findIndex(
          (t) => t._id === action.payload?._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateReservationTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Reservation Time
      .addCase(deleteReservationTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReservationTime.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteReservationTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Reservation Time
      .addCase(fetchReservationTimeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationTimeById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the time in the list
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchReservationTimeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reservationTimeSlice.reducer;
