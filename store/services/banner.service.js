import apiSlice from './api'

export const bannerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBanners: builder.query({
      query: ({ category }) => ({
        url: `/api/banner?category=${category}`,
        method: 'GET',
      }),
      providesTags: result =>
        result
          ? [
              ...result?.data.map(({ _id }) => ({
                type: 'Banner',
                id: _id,
              })),
              'Banner',
            ]
          : ['Banner'],
    }),
  }),
})

export const { useGetBannersQuery } = bannerApiSlice
