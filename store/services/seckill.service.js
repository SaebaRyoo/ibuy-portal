import apiSlice from './api'

export const seckillApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getActiveActivity: builder.query({
      query: () => ({
        url: '/v1/seckill/activity/active',
        method: 'GET',
      }),
      providesTags: ['Seckill'],
    }),

    getSeckillGoods: builder.query({
      query: ({ activityId }) => ({
        url: `/v1/seckill/goods/activity/${activityId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Seckill', id: arg.activityId }],
    }),

    placeSeckillOrder: builder.mutation({
      query: ({ seckillGoodsId, activityId, receiverAddress }) => ({
        url: '/v1/seckill/order',
        method: 'POST',
        body: { seckillGoodsId, activityId, receiverAddress },
      }),
      invalidatesTags: ['Seckill'],
    }),

    getSeckillOrder: builder.query({
      query: ({ id }) => ({
        url: `/v1/seckill/order/${id}`,
        method: 'GET',
      }),
    }),

    getSeckillOrders: builder.mutation({
      query: ({ current = 1, pageSize = 10 }) => ({
        url: '/v1/seckill/order/list',
        method: 'POST',
        body: { pageParam: { current, pageSize } },
      }),
    }),
  }),
})

export const {
  useGetActiveActivityQuery,
  useGetSeckillGoodsQuery,
  usePlaceSeckillOrderMutation,
  useGetSeckillOrderQuery,
  useGetSeckillOrdersMutation,
} = seckillApiSlice
