'use client'
import { ImageGallery, OutOfStock, VariantSelector } from 'components'
import { useCartList, useUrlQuery } from '@/hooks'
import {
  useAddToCartMutation,
  useGetSingleSkuQuery,
  useGetSkusBySpuIdQuery,
} from '@/store/services'
import { transformSpecObject } from '@/utils'

export default function SingleProduct() {
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
                // 修改s商品属性的结构
                //     spec: {"电视音响效果":"环绕","电视屏幕尺寸":"50英寸","尺码":"170"}
                //      ↓↓↓↓↓↓↓↓↓↓↓↓
                // 转换后：
                //     spec: [
                //       {
                //         name: '电视音响效果',
                //         value: '环绕',
                //       },
                //       {
                //         name: '电视屏幕尺寸',
                //         value: '50英寸',
                //       },
                //       {
                //         name: '尺码',
                //         value: '170',
                //       },
                //     ],
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

  const onAddToCart = async data => {
    // console.log('onAddToCart--->', data)
    await addToCart({
      id: data.id,
      num: data.num,
    })
    refetchCartList()
  }

  return (
    <main className="container mx-auto py-4 space-y-4">
      <div className="h-fit lg:h-fit lg:grid lg:grid-cols-9 lg:px-4 lg:gap-x-2 lg:gap-y-4 lg:mb-10 xl:gap-x-7">
        <ImageGallery
          images={product?.images?.split(',')}
          discount={2}
          inStock={product.num}
          productName={product.name}
        />
        <div className="lg:col-span-4 ">
          {/* title */}
          <h2 className="p-3 text-base font-semibold leading-8 tracking-wide text-black/80 ">
            {product.name}
          </h2>

          <div className="section-divide-y" />

          {/* 商品属性 */}
          <VariantSelector data={{ skus }} onAddToCart={onAddToCart} />

          {product.num === 0 && <OutOfStock />}

          {/* <Info infos={product?.info} /> */}
        </div>
      </div>
      <div className="section-divide-y" />

      <div className="flex">
        <div className="flex-1">
          {/* <Specification specification={product.specification} /> */}

          <div className="section-divide-y" />

          {/* <Reviews
            numReviews={product.numReviews}
            prdouctID={product._id}
            productTitle={product.title}
          /> */}
        </div>
      </div>
    </main>
  )
}

// export default SingleProduct
// export const dynamic = 'force-dynamic'
