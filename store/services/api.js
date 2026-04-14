import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { userLogin, userLogout } from '../slices/user.slice'

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
    // Refresh endpoint returns envelope: { data: { access_token } }
    const newToken = refreshResult.data?.data?.access_token
    if (newToken) {
      // 更新 Redux store 中的 token
      api.dispatch(userLogin(newToken))
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

  if (result.error) {
    const { status } = result.error

    if (status === 401) {
      // 如果是 401 错误
      if (!isRefreshing) {
        isRefreshing = true
        const refreshSuccess = await handleRefreshToken(api)

        if (refreshSuccess) {
          // 重试当前请求
          result = await baseQuery(args, api, extraOptions)
        } else {
          // 刷新失败，跳转到登录页
          api.dispatch(userLogout())
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
    } else if (status === 403) {
      // 无权限，返回带状态码的错误信息
      return {
        error: {
          status: 403,
          message: '抱歉，您没有权限访问此资源',
        },
      }
    } else if (status === 500) {
      // 服务器错误，返回带状态码的错误信息
      return {
        error: {
          status: 500,
          message: '服务器开小差了，请稍后再试',
        },
      }
    }

    // If still an error after retry, normalize error shape
    if (result.error) {
      const { status: errStatus } = result.error
      if (errStatus === 'FETCH_ERROR') {
        return {
          error: {
            status: errStatus,
            message: '网络连接失败，请检查网络设置',
          },
        }
      }
      if (errStatus === 'TIMEOUT_ERROR') {
        return {
          error: {
            status: errStatus,
            message: '请求超时，请稍后重试',
          },
        }
      }
      return {
        error: {
          status: result.error.status,
          message: result.error.data?.message || 'Unknown error',
          code: result.error.data?.code,
        },
      }
    }
  }

  const body = result.data

  // Backend business error (HTTP 200 + success: false)
  if (body?.success === false) {
    return {
      error: {
        status: body.code,
        message: body.message,
      },
    }
  }

  // Strip envelope — return only data
  return { data: body?.data }
}

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithIntercept,
  tagTypes: [
    'User',
    'Review',
    'Details',
    'Order',
    'Product',
    'Category',
    'Slider',
    'Banner',
    'Seckill',
  ],
  endpoints: builder => ({}),
})

export default apiSlice
