import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

export const fetchSliderById = createAsyncThunk(
  "sliders/fetchSliderById",

  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch slider ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loaidig slider ${error.message}`);

      throw error;
    }
  }
);

export const fetchSliders = createAsyncThunk(
  "sliders/fetchSliders",

  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders`);

      console.log("response", response);
      if (!response.ok) {
        throw new Error(`Failed to fetch slider ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log("eror", error);
      toast.error("error loading sliders ");
      throw error;
    }
  }
);

export const fetchHomeSliders = createAsyncThunk(
  "sliders/fetchSliders",

  async () => {
    try {
      const response = await fetch(`${process.env.API}/sliders`);

      if (!response.ok) {
        throw new Error(`Failed to fetch sliders ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loading sliders ${error.message}`);

      throw error;
    }
  }
);

export const createSlider = createAsyncThunk(
  "sliders/createSlider",

  async (sliderData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sliderData),
      });

      if (!response.ok) {
        throw new Error(`Failed  to create slider ${response.status}`);
      }

      const data = await response.json();

      toast.success("slider created successfuuly");

      return data;
    } catch (error) {
      toast.error(`error creating slider ${error.message}`);

      throw error;
    }
  }
);

export const updateSlider = createAsyncThunk(
  "sliders/updateSlider",

  async ({ id, sliderData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sliderData),
      });

      if (!response.ok) {
        throw new Error(`failed to update slider ${response.status}`);
      }

      const data = await response.json();

      toast.success("slider updated successfully");

      return data;
    } catch (error) {
      toast.error(`error updating sliders ${error.message}`);

      throw error;
    }
  }
);

export const deleteSlider = createAsyncThunk(
  "sliders/deleteSlider",

  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/sliders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`failed to delete slider ${response.status}`);
      }

      toast.success("slider deleted successfully");

      return id;
    } catch (error) {
      toast.error(`error deleting slider ${error.message}`);
    }
  }
);

const sliderSlice = createSlice({
  name: "sliders",

  initialState: {
    list: [],
    loading: false,

    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(createSlider.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(createSlider.fulfilled, (state, action) => {
        state.loading = false;

        console.log("action.payload", action.payload);
        state.list.push(action.payload);
      })

      .addCase(createSlider.rejected, (state, action) => {
        state.loading = false;
        console.log(" error action", action);
        state.error = action.error.message;
      })

      // fetch  sliders
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading = false;

        state.list = action.payload;
      })

      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      // update  sliders
      .addCase(updateSlider.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(updateSlider.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((s) => s._id === action.payload._id);

        if (index != -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(updateSlider.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      // delete sliders
      .addCase(deleteSlider.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((s) => s._id !== action.payload);
      })

      .addCase(deleteSlider.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      });
  },
});

export default sliderSlice.reducer;
