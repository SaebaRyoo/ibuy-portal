import apiSlice from './api'

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /**
     * 获取所有地址列表
     */
    getAddressList: builder.query({
      query: () => ({
        url: `/v1/address`,
        method: 'GET',
      }),
    }),

    // 创建地址
    addAddress: builder.mutation({
      query: body => {
        return {
          url: `/v1/address`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['address'],
    }),

    // 更新地址
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => {
        return {
          url: `/v1/address/${id}`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: ['address'],
    }),

    // 删除地址
    deleteAddress: builder.mutation({
      query: id => {
        return {
          url: `/v1/address/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['address'],
    }),
  }),
})

export const {
  useGetAddressListQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApiSlice
