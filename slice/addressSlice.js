import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

export const fetchAddressById = createAsyncThunk(
  "addresses/fetchAddressById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/user/address/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Address ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loaing Address ${error.message}`);

      throw error;
    }
  }
);

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/user/address`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Addresses ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loading Addresses ${error.message}`);
      throw error;
    }
  }
);




export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (areaData) => {
    try {
      const response = await fetch(`${process.env.API}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(areaData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create addresses ${response.ok}`);
      }

      const data = await response.json();

      toast.success("addresses created  successfully");
    } catch (error) {
      toast.error(`error creating addresses ${error.message}`);

      throw error;
    }
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ id, addressData }) => {
    try {
      const response = await fetch(`${process.env.API}/user/address/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`Failed to updateaddress  ${response.status}`);
      }

      const data = await response.json();

      toast.success("address updated successfully");
      return data;
    } catch (error) {
      toast.error(`erorr updating address ${error.message}`);
      throw error;
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/user/address/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed  to  delete address `);
      }

      toast.success("address deleted  succeefully");

      return id;
    } catch (error) {
      toast.error(`error deleting address ${error.message}`);

      throw error;
    }
  }
);

const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createAddress.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;

        state.list.push(action.payload);
      })

      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //fetch all address  for user

      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;

        state.list = action.payload;
      })

      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //update addresss

      .addCase(updateAddress.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((a) => a._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //delete  address

      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((a) => a._id !== action.payload);
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //fetch single address by id

      .addCase(fetchAddressById.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((a) => a._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })

      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      });
  },
});

export default addressSlice.reducer;
