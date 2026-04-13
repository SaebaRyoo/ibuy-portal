import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData: (state, action) => {
      state.cartItems = action.payload.items
      state.totalDiscount = action.payload.totalDiscount
      state.totalItems = action.payload.totalItems
      state.totalPrice = action.payload.totalPrice
    },
  },
})

export const { setCartData } = cartSlice.actions

export default cartSlice.reducer
