import {
  Icons,
  SpecialSell,
  DiscountProduct,
  ProductPrice,
  Depot,
  ResponsiveImage,
} from 'components'
import { truncate } from 'utils'

const ProductCard = props => {
  const { product } = props
  return (
    <a target="_blank" href={`/products/item?spuId=${product.spuId}&skuId=${product.id}`}>
      <article
        className={`pt-2 pb-3 border-b border-gray-100 sm:h-[540px] xl:h-[470px] sm:px-3 sm:border sm:hover:shadow-3xl`}
      >
        <SpecialSell discount={2} inStock={product.num} />
        <div className="flex items-center gap-4 sm:flex-col sm:space-x-4">
          <div className="sm:flex sm:p-1 ">
            <ResponsiveImage
              dimensions="h-[28vw] w-[26vw] sm:w-56 sm:h-60 sm:mb-8 xl:w-44 xl:h-48"
              src={product?.images?.split(',')[0]}
              alt={product.name}
            />
          </div>
          <div className="flex-1 space-y-5 sm:w-full">
            <h2 className="hidden text-xs leading-6 text-gray-800 break-all h-14 xl:block">
              {truncate(product.name, 70)}
            </h2>
            <h2 className="text-xs leading-6 text-gray-800 h-14 xl:hidden">
              {truncate(product.name, 90)}
            </h2>
            <div className="flex justify-between">
              <div>
                <Depot inStock={product.num} />
              </div>
              <div className="flex items-center gap-x-1">
                <span className="">1折</span>
                <Icons.Star className="icon text-amber-400" />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <DiscountProduct discount={2} />
              </div>
              {product.num !== 0 ? (
                <ProductPrice inStock={product.num} discount={2} price={product.price} />
              ) : (
                <span className="h-12 my-0.5">不可用</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </a>
  )
}

export default ProductCard
