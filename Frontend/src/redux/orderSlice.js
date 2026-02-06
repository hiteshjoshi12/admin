// orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../util/config';

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const headers = { 'Content-Type': 'application/json' };
      if (userInfo?.token) headers['Authorization'] = `Bearer ${userInfo.token}`;

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Order creation failed');
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
    paymentLoading: false, // NEW: Track Razorpay status
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
    // NEW: Action to handle when Razorpay modal is open
    setPaymentLoading: (state, action) => {
        state.paymentLoading = action.payload;
    }
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

export const { resetOrder, setPaymentLoading } = orderSlice.actions;
export default orderSlice.reducer;