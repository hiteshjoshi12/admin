import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';
import wishlistReducer from './wishlistSlice'; // 1. Import Wishlist Reducer

// 1. Load Cart from LocalStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// 2. Save Cart to LocalStorage
const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch {
    // Ignore write errors
  }
};

const preloadedState = {
  cart: loadCartState() // Hydrate store
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    auth: authReducer, 
    order: orderReducer,
    wishlist: wishlistReducer, // 2. Add Wishlist to Store
  },
  preloadedState
});

// 3. Subscribe to store updates
store.subscribe(() => {
  saveCartState(store.getState().cart);
});

export default store;