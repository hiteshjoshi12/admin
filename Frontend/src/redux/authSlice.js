import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../config/config';
// 1. LOGIN
export const login = createAsyncThunk('auth/login', async ({ email, password, localCart }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, localCart }),
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 2. REGISTER
export const register = createAsyncThunk(
  'auth/register', 
  async ({ name, email, password, localCart }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, localCart }),
        credentials: 'include',
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

// 3. SAVE ADDRESS
export const saveAddressToProfile = createAsyncThunk(
  'auth/saveAddress',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const response = await fetch(`${config.API_BASE_URL}/api/users/profile/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(addressData),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. UPDATE ADDRESS (FIXED: Added this thunk)
export const updateAddressInProfile = createAsyncThunk(
  'auth/updateAddress',
  async ({ id, addressData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      // Notice the URL includes the ID: /address/${id}
      const response = await fetch(`${config.API_BASE_URL}/api/users/profile/address/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(addressData),
        credentials: 'include',
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

// 5. DELETE ADDRESS (FIXED: Added this thunk)
export const deleteAddressFromProfile = createAsyncThunk(
  'auth/deleteAddress',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const response = await fetch(`${config.API_BASE_URL}/api/users/profile/address/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
    userInfo: loadUserFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
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
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // REGISTER
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // ADDRESS CASES (CRITICAL FIX: Ensure all 3 are here)
      .addCase(saveAddressToProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload; 
      })
      .addCase(updateAddressInProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload; // <--- This updates the UI when you click "Set as Primary"
      })
      .addCase(deleteAddressFromProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload; // <--- This updates the UI when you delete
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;