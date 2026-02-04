import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API_BASE_URL} from '../util/config';

// 1. ASYNC THUNK: Fetch All Products (with Pagination & Search)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ pageNumber = 1, keyword = '', category, size, priceRange, sort }, { rejectWithValue }) => {
    try {
      // Build Query Params
      const params = new URLSearchParams();
      params.append('pageNumber', pageNumber);
      if (keyword) params.append('keyword', keyword);
      if (category && category.length > 0) params.append('category', category.join(','));
      if (size && size.length > 0) params.append('size', size.join(','));
      if (priceRange) params.append('priceRange', priceRange);
      if (sort) params.append('sort', sort);

      const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
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
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      
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
    pages: 1,       // Total pages
    total: 0,       // <--- ADDED THIS: Total count of products found
    
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
        state.items = action.payload.products; 
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.totalProducts; // <--- ADDED THIS to match backend response
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