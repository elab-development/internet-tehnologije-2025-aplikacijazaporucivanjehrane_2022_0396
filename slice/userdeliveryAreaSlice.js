import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

export const fetchDeliveryAreas = createAsyncThunk(
  "userdeliveryAreas/fetchDeliveryAreas",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/user/delivery-areas`);

      if (!response.ok) {
        throw new Error(`Failed to fetch DeliveryAreas ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loading DeliveryAreas ${error.message}`);
      throw error;
    }
  }
);

const userdeliveryAreaSlice = createSlice({
  name: "userdeliveryAreas",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      //fetch all delivey area   for admin

      .addCase(fetchDeliveryAreas.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchDeliveryAreas.fulfilled, (state, action) => {
        state.loading = false;

        state.list = action.payload;
      })

      .addCase(fetchDeliveryAreas.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      });
  },
});

export default userdeliveryAreaSlice.reducer;
