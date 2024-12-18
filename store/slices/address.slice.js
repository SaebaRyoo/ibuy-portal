import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // 选中的地址的id
  currentSelectedAddress: null,

  // addresses
  addresses: [],
}

const address = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setCurAddress: (state, action) => {
      state.currentSelectedAddress = action.payload
    },

    setAddresses: (state, action) => {
      state.addresses = action.payload
    },
  },
})

export const { setCurAddress, setAddresses } = address.actions

export default address.reducer
