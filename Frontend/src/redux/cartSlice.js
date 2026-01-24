import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], 
  totalQuantity: 0,
  totalAmount: 0,
  // --- NEW FIELDS FOR CHECKOUT ---
  shippingAddress: {}, 
  paymentMethod: 'Razorpay', 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. ADD ITEM
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size);
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id, // Using the unique _id from MongoDB
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          quantity: newItem.quantity || 1, 
          size: newItem.size,
          totalPrice: newItem.price * (newItem.quantity || 1),
        });
      } else {
        existingItem.quantity += newItem.quantity || 1;
        existingItem.totalPrice += newItem.price * (newItem.quantity || 1);
      }
      
      // Recalculate Totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // 2. REMOVE ITEM
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== id);
        // Recalculate
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },

    // 3. UPDATE QUANTITY
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
      }
      
      // Recalculate
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // 4. SET CART (For Login Merge or Loading from DB)
    setCart: (state, action) => {
      state.items = action.payload;
      // Force recalculate totals based on the new array
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // 5. CLEAR CART (For Logout or Checkout Success)
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.shippingAddress = {}; // Optional: clear address on logout
    },

    // --- NEW REDUCERS FOR CHECKOUT ---
    
    // 6. SAVE SHIPPING ADDRESS
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },

    // 7. SAVE PAYMENT METHOD
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  setCart,
  saveShippingAddress, // Exporting new action
  savePaymentMethod    // Exporting new action
} = cartSlice.actions;

export default cartSlice.reducer;