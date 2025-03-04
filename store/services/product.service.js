import apiSlice from './api'

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: ({ category, page_size, page, sort, search, inStock, discount, price }) => {
        const queryParams = new URLSearchParams()

        Object.entries({
          category,
          page_size,
          page,
          sort,
          search,
          inStock,
          discount,
          price,
        }).forEach(([key, value]) => {
          if (value) queryParams.set(key, value)
        })

        return {
          url: `/v1/spu?${queryParams.toString()}`,
          method: 'GET',
        }
      },
      providesTags: result => {
        return result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Product',
                id: id,
              })),
              'Product',
            ]
          : ['Product']
      },
    }),

    /**
     * 获取热销商品
     */
    getBestSellers: builder.query({
      query: ({ limit }) => {
        return {
          url: `/v1/sku/best-sellers/${limit}`,
          method: 'GET',
        }
      },
      providesTags: result => {
        return result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Product',
                id: id,
              })),
              'Product',
            ]
          : ['Product']
      },
    }),

    /**
     * 获取单一sku
     */
    getSingleSku: builder.query({
      query: ({ id }) => ({
        url: `/v1/sku/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    }),

    /**
     * 根据spuId获取sku列表
     */
    getSkusBySpuId: builder.query({
      query: ({ spuId }) => ({
        url: `/v1/sku/spu/${spuId}`,
        method: 'GET',
      }),
      providesTags: result => {
        return result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Product',
                id: id,
              })),
              'Product',
            ]
          : ['Product']
      },
    }),

    // 商品搜索
    searchProducts: builder.query({
      query: searchMap => {
        const queryParams = new URLSearchParams()

        Object.entries(searchMap).forEach(([key, value]) => {
          if (value) queryParams.set(key, value)
        })

        return {
          url: `/v1/search/query?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetBestSellersQuery,
  useGetSingleSkuQuery,
  useGetSkusBySpuIdQuery,
  useSearchProductsQuery,
} = productApiSlice
