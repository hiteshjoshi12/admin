import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../config/config';

// 1. ASYNC THUNK: Fetch All Products (with Pagination & Search)
// Accepts an object: { keyword: 'silk', pageNumber: 1 }
export const fetchProducts = createAsyncThunk(
  'products/fetchAll', 
  async ({ keyword = '', pageNumber = 1 } = {}, { rejectWithValue }) => {
    try {
      // Construct URL with query parameters
      const response = await fetch(
        `${config.API_BASE_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      
      if (!response.ok) {
        throw new Error('Server Error');
      }
      
      const data = await response.json();
      // data structure expected: { products: [...], page: 1, pages: 10 }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. ASYNC THUNK: Fetch Single Product Details
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails', 
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],      // The list of products for the Shop page
    product: null,  // The single product detail
    
    // Pagination State
    page: 1,        // Current page number
    pages: 1,       // Total number of pages available
    
    loading: false, // Global loading state
    error: null,    // Global error state
  },
  reducers: {
    // Action to clear single product data when leaving the detail page
    clearProductDetails: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Handle Fetch Products (List) ---
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // The API now returns an object { products, page, pages }
        state.items = action.payload.products; 
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Handle Fetch Product Details (Single) ---
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;