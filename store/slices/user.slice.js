import { createSlice } from '@reduxjs/toolkit'

// 初始状态为空，在客户端执行时再获取
const initialState = { token: '' }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: state => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      state.token = ''
    },

    userLogin: (state, action) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload)
      }
      state.token = action.payload
    },

    // 初始化 action 在客户端加载时调用
    initializeToken: state => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
          state.token = savedToken
        }
      }
    },
  },
})

export const { userLogout, userLogin, initializeToken } = userSlice.actions

export default userSlice.reducer
