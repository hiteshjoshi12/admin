import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../util/config';

// 1. ASYNC THUNK: Fetch All Products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ pageNumber = 1, keyword = '', category, size, priceRange, sort }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('pageNumber', pageNumber);
      if (keyword) params.append('keyword', keyword);
      if (category && category.length > 0) params.append('category', category.join(','));
      if (size && size.length > 0) params.append('size', size.join(','));
      if (priceRange) params.append('priceRange', priceRange);
      if (sort) params.append('sort', sort);

      const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. FIXED ASYNC THUNK: Fetch Single Product Details by SLUG
// We changed the parameter name from 'id' to 'slug' for clarity
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails', 
  async (slug, { rejectWithValue }) => {
    try {
      // ✅ Now calling the slug-based endpoint
      const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Product not found');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],      
    product: null,  
    page: 1,        
    pages: 1,       
    total: 0,       
    loading: false, 
    error: null,    
  },
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
      state.error = null; // Also clear errors when leaving
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products; 
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.totalProducts; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Optional: clear previous product immediately to prevent "flicker" 
        // of old data while loading the new one
        state.product = null; 
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