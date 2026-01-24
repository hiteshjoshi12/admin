import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. ASYNC THUNK: Login User
export const login = createAsyncThunk('auth/login', async ({ email, password, localCart }, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, localCart }), // Send cart to merge
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Login failed');

    // Save to LocalStorage so they stay logged in on refresh
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 2. ASYNC THUNK: Register User
export const register = createAsyncThunk(
  'auth/register', 
  // Destructure localCart from the arguments
  async ({ name, email, password, localCart }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send localCart in the body
        body: JSON.stringify({ name, email, password, localCart }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW ASYNC THUNK: Save Address
export const saveAddressToProfile = createAsyncThunk(
  'auth/saveAddress',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      const response = await fetch('http://localhost:5000/api/users/profile/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update LocalStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Helper to load user from local storage
const loadUserFromStorage = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: loadUserFromStorage(), // Load on start
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
  
      // LOGIN
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      // NEW CASE: Update User Info when Address is saved
      .addCase(saveAddressToProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload; // Updates Redux with new address list
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // REGISTER
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;