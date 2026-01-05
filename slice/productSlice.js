import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/products/${id}`);

      if (!response.ok) {
        throw new Error(`failed to fetch product ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loadin product ${error.message}`);

      throw error;
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",

  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/products`);

      if (!response.ok) {
        throw new Error(`failed to fetch products ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loading products ${error.message}`);
      throw error;
    }
  }
);

export const fetchHomeProducts = createAsyncThunk(
  "products/fetchHomeProducts",

  async () => {
    try {
      const response = await fetch(`${process.env.API}/products`);

      if (!response.ok) {
        throw new Error(`failed to fetch products ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error  loading products ${error.message}`);

      throw error;
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",

  async (prodcutData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(prodcutData),
      });

      if (!response.ok) {
        throw new Error(` failed to create products ${response.status}`);
      }

      const data = await response.json();

      toast.success("Product  created successfully");

      return data;
    } catch (error) {
      toast.error(`error creating product ${error.message}`);

      throw error;
    }
  }
);

export const updateProudct = createAsyncThunk(
  "products/updateProduct",

  async ({ id, productData }) => {

 console.log({ id,productData})

    try {
      const response = await fetch(`${process.env.API}/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`failed to update product ${response.status} `);
      }

      const data = await response.json();

      toast.success("Product updated successfully");

      return data;
    } catch (error) {
      toast.error(`error updating product  ${error}`);

      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",

  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`failed to delete  product ${response.status}`);
      }

      toast.success("Product deleted successfully");

      return id;
    } catch (error) {
      toast.error("error deleting products");
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
    homeProducts: [],
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createProduct.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetch all products

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetch  home prodcuts

      .addCase(fetchHomeProducts.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.homeProducts = action.payload;
      })

      .addCase(fetchHomeProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //update prodcut

      .addCase(updateProudct.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(updateProudct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(updateProudct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //delete prodcut

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((p) => p._id !== action.payload);
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetch product by id

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((p) => p._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
