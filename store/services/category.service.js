import apiSlice from './api'

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query({
      query: () => ({
        url: '/v1/category/all',
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result?.data?.map(({ id }) => ({
                type: 'Category',
                id: id,
              })),
              'Category',
            ]
          : ['Category'],
    }),
  }),
})

export const { useGetCategoriesQuery } = categoryApiSlice
