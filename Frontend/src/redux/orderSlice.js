import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../config/config';
// ASYNC THUNK: Create Order
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      // 1. Get User Token from State
      const {
        auth: { userInfo },
      } = getState();

      // 2. Make API Call
      const response = await fetch(`${config.API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Secure Route
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    success: false,
    order: null,
    error: null,
  },
  reducers: {
    resetOrder: (state) => {
      state.loading = false;
      state.success = false;
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;