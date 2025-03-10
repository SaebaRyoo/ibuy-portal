import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { userLogin } from '../slices/user.slice'

let isRefreshing = false
let requests = []

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

// 处理刷新 token
const handleRefreshToken = async api => {
  try {
    // 调用刷新 token 的接口
    const refreshResult = await baseQuery(
      {
        url: '/v1/auth/refresh',
        method: 'GET',
      },
      api,
      {}
    )
    // console.log('refreshResult', refreshResult)
    if (refreshResult.data.data?.access_token) {
      // 更新 Redux store 中的 token
      api.dispatch(userLogin(refreshResult.data.data.access_token))
      // 执行队列中失败的请求
      requests.forEach(cb => cb())
      requests = []
      return true
    }
    return false
  } catch (err) {
    return false
  } finally {
    isRefreshing = false
  }
}

// 拦截器
const baseQueryWithIntercept = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  // console.log('args', args)
  // console.log('result', result)
  // console.log('extraOptions', extraOptions)
  if (result.error && result.error.status === 401) {
    // 如果是 401 错误
    if (!isRefreshing) {
      isRefreshing = true
      const refreshSuccess = await handleRefreshToken(api)

      if (refreshSuccess) {
        // 重试当前请求
        result = await baseQuery(args, api, extraOptions)
      } else {
        // 刷新失败，跳转到登录页
        const currentUrl = window.location.pathname
        window.location.href = `/login?redirectTo=${currentUrl}`
        return result
      }
    } else {
      // 将并发请求添加到队列
      return new Promise(resolve => {
        requests.push(async () => {
          const retryResult = await baseQuery(args, api, extraOptions)
          resolve(retryResult)
        })
      })
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
