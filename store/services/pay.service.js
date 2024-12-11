import apiSlice from './api'

export const paySlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // 支付宝支付, queueName有以下参数类型 ORDER_PAY: 正常订单支付  SEC_KILL_ORDER_PAY: 秒杀支付
    getAlipayUrl: builder.mutation({
      query: ({ orderId, queueName }) => ({
        url: `/v1/alipay/goAlipay?orderId=${orderId}&queueName=${queueName}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetAlipayUrlMutation } = paySlice
