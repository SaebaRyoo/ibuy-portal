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

    getSingleOrder: builder.query({
      query: ({ id }) => ({
        url: `/api/order/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
    }),

    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/order/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.id }],
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
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useCreateOrderMutation,
} = orderApiSlice
