import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

export const fetchDeliveryAreaById = createAsyncThunk(
  "deliveryAreas/fetchDeliveryAreaById",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/delivery-areas/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch delivery-areas ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loaing delivery-areas ${error.message}`);

      throw error;
    }
  }
);

export const fetchDeliveryAreas = createAsyncThunk(
  "deliveryAreas/fetchDeliveryAreas",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/delivery-areas`);

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

// export const fetchHomeCategories = createAsyncThunk(
//   "categories/fetchHomeCategories",
//   async () => {
//     try {
//       const response = await fetch(`${process.env.API}/categories`);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch categories ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       toast.error(`error loading categories ${error.message}`);

//       throw error;
//     }
//   }
// );

export const createDeliveryArea = createAsyncThunk(
  "deliveryAreas/createDeliveryArea",
  async (areaData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/delivery-areas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(areaData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create DeliveryArea ${response.ok}`);
      }

      const data = await response.json();

      toast.success("DeliveryArea created  successfully");
    } catch (error) {
      toast.error(`error creating DeliveryArea ${error.message}`);

      throw error;
    }
  }
);

export const updateDeliveryArea = createAsyncThunk(
  "deliveryAreas/updateDeliveryArea",
  async ({ id, areaData }) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/delivery-areas/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(areaData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update DeliveryArea  ${response.status}`);
      }

      const data = await response.json();

      toast.success("DeliveryArea  updated successfully");
      return data;
    } catch (error) {
      toast.error(`erorr updating DeliveryArea ${error.message}`);
      throw error;
    }
  }
);

export const deleteDeliveryArea = createAsyncThunk(
  "deliveryAreas/deleteDeliveryArea ",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/delivery-areas/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Failed  to  delete DeliveryArea  `);
      }

      toast.success("DeliveryArea  deleted  succeefully");

      return id;
    } catch (error) {
      toast.error(`error deleting DeliveryArea  ${error.message}`);

      throw error;
    }
  }
);

const deliveryAreaSlice = createSlice({
  name: "deliveryAreas",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createDeliveryArea.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(createDeliveryArea.fulfilled, (state, action) => {
        state.loading = false;

        state.list.push(action.payload);
      })

      .addCase(createDeliveryArea.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

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
      })

      //update delivey areas

      .addCase(updateDeliveryArea.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(updateDeliveryArea.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((a) => a._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(updateDeliveryArea.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //delete   devily area

      .addCase(deleteDeliveryArea.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(deleteDeliveryArea.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((a) => a._id !== action.payload);
      })

      .addCase(deleteDeliveryArea.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //fetch single delivery area by id

      .addCase(fetchDeliveryAreaById.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchDeliveryAreaById.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((a) => a._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })

      .addCase(fetchDeliveryAreaById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      });
  },
});

export default deliveryAreaSlice.reducer;
