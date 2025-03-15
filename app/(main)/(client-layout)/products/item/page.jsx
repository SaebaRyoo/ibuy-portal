'use client'

import { ImageGallery, OutOfStock, VariantSelector } from 'components'
import { useCartList, useUrlQuery } from '@/hooks'
import { useRouter } from 'next/navigation'
import {
  useAddToCartMutation,
  useGetSingleSkuQuery,
  useGetSkusBySpuIdQuery,
} from '@/store/services'
import { transformSpecObject, BuyType } from '@/utils'

export default function SingleProduct() {
  const router = useRouter()
  const query = useUrlQuery()
  const spuId = query?.spuId?.toString() ?? ''
  const skuId = query?.skuId?.toString() ?? ''
  // Fetch Product Data
  const { product, isLoading } = useGetSingleSkuQuery(
    { id: skuId },
    {
      selectFromResult: ({ data, isLoading }) => ({
        product: data?.data ?? {},
        isLoading,
      }),
    }
  )

  const { skus } = useGetSkusBySpuIdQuery(
    { spuId },
    {
      selectFromResult: ({ data, isLoading }) => {
        return {
          skus: data?.data
            ? data?.data.map(sku => ({
                ...sku,
                // 转换后的商品属性结构
                spec: transformSpecObject(sku.spec),
              }))
            : [],
          isLoading,
        }
      },
    }
  )

  const [addToCart, { data, isSuccess, isError, isLoading: addToCartLoading, error }] =
    useAddToCartMutation()
  const { refetch: refetchCartList } = useCartList()

  // 加入购物车
  const onAddToCart = async data => {
    await addToCart({
      id: data.id,
      num: data.num,
    })
    refetchCartList()
  }

  // 立即购买，跳转到shipping页面
  const onBuyNow = async data => {
    router.push(`/checkout/shipping?buyType=${BuyType.direct}&skuId=${data.id}&num=${data.num}`)
  }

  return (
    <main className="container mx-auto py-4 space-y-8">
      <div className="lg:grid lg:grid-cols-9 lg:gap-x-6 lg:px-6 lg:py-6">
        {/* 产品图片 */}
        <div className="lg:col-span-5">
          <ImageGallery
            images={product?.images?.split(',')}
            discount={2}
            inStock={product.num}
            productName={product.name}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* 产品标题 */}
          <h1 className="text-2xl font-semibold text-gray-800 leading-snug">{product.name}</h1>

          <div className="border-t border-gray-200 pt-4" />

          {/* 商品属性选择 */}
          <VariantSelector data={{ skus }} onAddToCart={onAddToCart} onPressConfirm={onBuyNow} />

          {product.num === 0 && <OutOfStock />}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6" />

      {/* 产品描述或评论部分 */}
      <div className="flex flex-col space-y-6">
        <div className="section-divide-y" />
      </div>
    </main>
  )
}
