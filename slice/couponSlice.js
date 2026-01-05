import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import { toast } from "react-toastify";

export const fetchCouponById = createAsyncThunk(
  "coupons/fetchCouponById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch coupon ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loaing coupon ${error.message}`);

      throw error;
    }
  }
);

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Coupons ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`error loading Coupons ${error.message}`);
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





export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (couponData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create Coupon ${response.ok}`);
      }

      const data = await response.json();

      toast.success("Coupon created  successfully");
    } catch (error) {
      toast.error(`error creating Coupon ${error.message}`);

      throw error;
    }
  }
);

export const updateCoupon= createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, couponData }) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/coupons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to updateCoupon  ${response.status}`);
      }

      const data = await response.json();

      toast.success("Coupon  updated successfully");
      return data;
    } catch (error) {
      toast.error(`erorr updating Coupon ${error.message}`);
      throw error;
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/coupons/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Failed  to  delete Coupon `);
      }

      toast.success("Coupon deleted  succeefully");

      return id;
    } catch (error) {
      toast.error(`error deleting Coupon ${error.message}`);

      throw error;
    }
  }
);



const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    list: [],
    loading: false,
    error: null,
  
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createCoupon.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;

        state.list.push(action.payload);
      })

      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //fetch all categories   for admin

      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;

        state.list = action.payload;
      })

      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

     
      //update category

      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((c) => c._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //delete  category

      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((c) => c._id !== action.payload);
      })

      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })

      //fetch single category by id

      .addCase(fetchCouponById.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex((c) => c._id === action.payload._id);

        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })

      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      });
  },
});


  export default  couponSlice.reducer