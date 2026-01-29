import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../util/config';

// 1. Helper to Load from LocalStorage
const loadWishlistFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('wishlist');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    return [];
  }
};

// --- ASYNC ACTIONS ---

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.userInfo) return []; 

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${auth.userInfo.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlistAPI = createAsyncThunk(
  'wishlist/toggleAPI',
  async (product, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${product._id}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // 🚨 REMOVED TOAST FROM HERE
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromStorage(), 
    loading: false,
    error: null
  },
  reducers: {
    // 🚨 REMOVED TOAST FROM HERE TOO
    toggleWishlistLocal: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex((item) => item._id === product._id);

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },

    clearWishlist: (state) => {
        state.items = [];
        localStorage.removeItem('wishlist');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlistAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase('auth/logout', (state) => {
        state.items = [];
        localStorage.removeItem('wishlist');
      });
  }
});

export const { toggleWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;