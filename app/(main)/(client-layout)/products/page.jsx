'use client'

import { ProductCard, Pagination, Sort, ProductsAside, ProductSkeleton } from 'components'

import { useChangeRoute, useMediaQuery } from 'hooks'

import { useUrlQuery } from '@/hooks'
import { useSearchProductsQuery } from '@/store/services'

const ProductsHome = () => {
  // Assets
  const query = useUrlQuery()

  const category = query?.category?.toString() ?? ''
  const page_size = query?.page_size?.toString() ?? ''
  const page = query?.page?.toString() ?? ''
  const sort = query?.sort?.toString() ?? ''
  const search = query?.search?.toString() ?? ''
  const inStock = query?.inStock?.toString() ?? ''
  const discount = query?.discount?.toString() ?? ''
  const price = query?.price?.toString() ?? ''

  const isDesktop = useMediaQuery('(min-width:1280px)')

  // Handlers
  const changeRoute = useChangeRoute()

  const handleChangeRoute = newQueries => {
    changeRoute({
      ...query,
      page: 1,
      ...newQueries,
    })
  }

  // Search Data
  const { searchData, isFetching: isFetchingProduct } = useSearchProductsQuery(
    {
      categoryName: category,
    },
    {
      selectFromResult: ({ isLoading, data }) => {
        return { searchData: data?.data.data ?? [], isFetching: isLoading }
      },
    }
  )

  return (
    <>
      <main className="lg:px-3 container xl:mt-32">
        <div className="px-1 lg:flex lg:gap-x-0 xl:gap-x-3">
          {/* <ProductsAside mainMaxPrice={0} mainMinPrice={0} handleChangeRoute={handleChangeRoute} /> */}
          <div id="_products" className="w-full p-4 mt-3 ">
            {/* Filters & Sort */}
            <div className="divide-y-2 ">
              <div className="flex py-2 gap-x-3">
                <Sort handleChangeRoute={handleChangeRoute} />
              </div>

              <div className="flex justify-between py-2">
                <span>所有商品</span>
                <span className="">{searchData?.total} 件商品</span>
              </div>
            </div>

            {/* Products */}
            {isFetchingProduct ? (
              <ProductSkeleton />
            ) : searchData && searchData?.total > 0 ? (
              <section className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {searchData?.rows.map(item => <ProductCard product={item} key={item.id} />)}
              </section>
            ) : (
              <section className="text-center text-cPink xl:border xl:border-gray-200 xl:rounded-md xl:py-4">
                没有找到商品
              </section>
            )}
          </div>
        </div>

        {/* {searchData && searchData?.total > 10 && (
          <div className="py-4 mx-auto lg:max-w-5xl">
            <Pagination
              pagination={searchData?.totalPages}
              changeRoute={handleChangeRoute}
              section="_products"
              client
            />
          </div>
        )} */}
      </main>
    </>
  )
}

export default ProductsHome
