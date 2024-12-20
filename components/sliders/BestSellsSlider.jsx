import Link from 'next/link'

import { Icons, ResponsiveImage, Skeleton } from 'components'
import { truncate } from 'utils'
import { useGetBestSellersQuery } from '@/store/services'

const BestSellsSlider = () => {
  const { products, isLoading } = useGetBestSellersQuery(
    {
      limit: 10,
    },
    {
      selectFromResult: ({ data, isLoading }) => ({
        products: data?.data,
        isLoading,
      }),
    }
  )

  return (
    <section className="px-3">
      <div className="flex items-center mb-3 space-x-2">
        <Icons.Check className="w-7 h-7 text-amber-400" />
        <h2 className="text-xl font-semibold">最畅销商品</h2>
      </div>

      {/* 商品容器：使用 grid 布局，确保每行显示5个商品 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array(12)
              .fill('_')
              .map((_, index) => (
                <Skeleton.Items key={index} className="flex space-x-4 p-1">
                  <Skeleton.Item
                    height="h-24"
                    width="w-24"
                    animated="background"
                    className="rounded-md mx-auto"
                  />
                  <Skeleton.Item
                    height="h-5"
                    width="w-32"
                    animated="background"
                    className="mt-4 mx-auto"
                  />
                </Skeleton.Items>
              ))
          : products?.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col items-center space-y-3 hover:bg-gray-50 rounded-lg p-3 transition duration-200 ease-in-out"
              >
                <Link href={`/products/item?spuId=${item.spuId}&skuId=${item.id}`} passHref>
                  <article className="flex flex-col items-center space-y-3">
                    {/* 商品图片和排名横向排列 */}
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl text-sky-500">{index + 1}</span>
                      <ResponsiveImage
                        dimensions="w-24 h-24"
                        src={item.images?.split(',')[0] ?? []}
                        alt={item.name}
                        className="shrink-0"
                      />
                    </div>
                    {/* 商品名称纵向排列 */}
                    <span className="text-sm text-gray-700 text-center">
                      {truncate(item.name, 40)}
                    </span>
                  </article>
                </Link>
              </div>
            ))}
      </div>
    </section>
  )
}

export default BestSellsSlider
