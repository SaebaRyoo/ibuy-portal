import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'

import { existItem, getTotal } from 'utils'

const setCartItems = cartItems => localStorage.setItem('cartItems', JSON.stringify(cartItems))

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
      state.cartItems = action.payload.data
      state.totalDiscount = action.payload.totalDiscount
      state.totalItems = action.payload.totalItems
      state.totalPrice = action.payload.totalPrice
    },
  },
})

export const { setCartData } = cartSlice.actions

export default cartSlice.reducer
