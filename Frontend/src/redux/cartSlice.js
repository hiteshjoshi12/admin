import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../util/config';
// 🚨 NO IMPORTS from authSlice to prevent crashes

// --- ASYNC THUNK: SYNC CART ---
export const syncCartToBackend = createAsyncThunk(
  'cart/sync',
  async (cartItems, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.userInfo) return; 

    try {
      await fetch(`${API_BASE_URL}/api/users/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
        // Filter garbage data
        body: JSON.stringify({ cart: cartItems.filter(item => item.quantity > 0) }),
      });
      return true; // Return success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const calculateTotals = (state) => {
  state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  localStorage.setItem('cartItems', JSON.stringify(state.items));
  localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
};

const itemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
  items: itemsFromStorage,
  totalQuantity: 0,
  totalAmount: 0,
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: 'Razorpay',
  coupon: null,
  // 🟢 DIRTY FLAG: Defaults to false. 
  // True = User changed something, needs sync. 
  // False = Data is fresh from DB or empty, DO NOT SYNC.
  isDirty: false 
};

// Init Totals
const tempState = { ...initialState };
calculateTotals(tempState);
initialState.totalQuantity = tempState.totalQuantity;
initialState.totalAmount = tempState.totalAmount;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size);
      if (!existingItem) {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      } else {
        existingItem.quantity += newItem.quantity || 1;
        existingItem.maxStock = newItem.maxStock; 
      }
      state.isDirty = true; // ✅ User Action = Dirty
      calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter((item) => !(item.id === id && item.size === size));
      state.isDirty = true; // ✅ User Action = Dirty
      calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size);
      if (existingItem) {
        const limit = existingItem.maxStock > 0 ? existingItem.maxStock : 10;
        existingItem.quantity = Math.max(0, Math.min(quantity, limit));
      }
      state.isDirty = true; // ✅ User Action = Dirty
      calculateTotals(state);
    },

    setCart: (state, action) => {
      // 1. Clean Data
      const validItems = action.payload.filter(item => item.quantity > 0);
      state.items = validItems.map(item => {
        const mutableItem = { ...item };
        if (mutableItem.maxStock > 0 && mutableItem.quantity > mutableItem.maxStock) {
            mutableItem.quantity = mutableItem.maxStock; 
        }
        return mutableItem;
      });
      // 🛑 DB Load = Clean (Not Dirty). Do NOT sync this back immediately.
      state.isDirty = false; 
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.coupon = null; // ✅ Clear coupon on manual clear
      state.isDirty = false; 
      localStorage.removeItem('cartItems');
    },

    saveShippingAddress: (state, action) => { state.shippingAddress = action.payload; },
    savePaymentMethod: (state, action) => { state.paymentMethod = action.payload; },
    applyDiscount: (state, action) => { state.coupon = action.payload; },
    removeDiscount: (state) => { state.coupon = null; },
  },
  
  // 🚨 CRASH FIX: Use String Literals. No Imports needed.
  extraReducers: (builder) => {
    builder
      // When sync is done, we are clean again
      .addCase(syncCartToBackend.fulfilled, (state) => {
          state.isDirty = false;
      })
      // Match 'auth/login/fulfilled' string manually
      .addCase('auth/login/fulfilled', (state) => {
         state.isDirty = false; // Just logged in? Clean. Don't sync yet.
      })
      .addCase('auth/register/fulfilled', (state) => {
         state.isDirty = false; 
      })
      // Match 'auth/logout' (Synchronous action)
      .addCase('auth/logout', (state) => {
         state.items = [];
         state.totalQuantity = 0;
         state.totalAmount = 0;
         state.coupon = null; // ✅ FIXED: Clear coupon on logout
         state.isDirty = false; 
         localStorage.removeItem('cartItems');
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart, saveShippingAddress, savePaymentMethod, applyDiscount, removeDiscount } = cartSlice.actions;
export default cartSlice.reducer;