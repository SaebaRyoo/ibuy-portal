import apiSlice from './api'

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // 获取订单列表
    getOrders: builder.query({
      query: ({ current = 1, pageSize = 10, orderStatus }) => ({
        url: `/v1/order/list/${current}/${pageSize}${orderStatus ? `?orderStatus=${orderStatus}` : ''}`,
        method: 'GET',
      }),
    }),

    // 获取订单详情列表
    getOrderItems: builder.query({
      query: ({ id }) => ({
        url: `/v1/order-items/item/${id}`,
        method: 'GET',
      }),
    }),

    // 从购物车列表创建订单
    createOrderFromCartList: builder.mutation({
      query: ({ body }) => ({
        url: '/v1/order/cart/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    createOrder: builder.mutation({
      query: ({ body }) => ({
        url: '/api/order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderItemsQuery,
  useCreateOrderFromCartListMutation,
  useCreateOrderMutation,
} = orderApiSlice
