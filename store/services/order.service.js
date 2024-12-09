import apiSlice from './api'

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query({
      query: ({ current = 1, pageSize = 10, orderStatus }) => ({
        url: `/v1/order/list/${current}/${pageSize}${orderStatus ? `?orderStatus=${orderStatus}` : ''}`,
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
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useCreateOrderMutation,
} = orderApiSlice
