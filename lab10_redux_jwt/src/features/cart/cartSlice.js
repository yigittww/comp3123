import { createSlice } from '@reduxjs/toolkit';

const PRODUCTS = [
  { id: 'p1', name: 'Redux Mug', price: 12 },
  { id: 'p2', name: 'JWT Sticker Pack', price: 5 },
  { id: 'p3', name: 'React Hoodie', price: 45 },
];

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] }, // items: { id, name, price, qty }
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export { PRODUCTS };
export default cartSlice.reducer;
