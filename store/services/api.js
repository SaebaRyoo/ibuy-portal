import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
// import { userLogout } from '../slices/user.slice'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

// 拦截器
const baseQueryWithIntercept = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  // console.log('拦截器 --->', result)
  const { data, error } = result
  // 如果遇到错误的时候
  if (error) {
    const { status } = error
    if (error.status === 401) {
      // 清除token
      // api.dispatch(userLogout())
    }
  }
  return result
}

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithIntercept,
  tagTypes: ['User', 'Review', 'Details', 'Order', 'Product', 'Category', 'Slider', 'Banner'],
  endpoints: builder => ({}),
})

export default apiSlice
