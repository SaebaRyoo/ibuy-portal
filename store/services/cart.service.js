import apiSlice from './api'

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /**
     * 添加商品到购物车
      id?: string;
      num?: string;
      username?: string;
     */
    addToCart: builder.mutation({
      query: params => {
        return {
          url: `/v1/cart/add?username=${params.username}&id=${params.id}&num=${params.num}`,
          method: 'POST',
        }
      },
      invalidatesTags: ['Cart'],
    }),

    /**
     * 获取购物车列表
     */
    getCartList: builder.query({
      query: () => ({
        url: `/v1/cart/list`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useAddToCartMutation, useGetCartListQuery } = cartApiSlice
