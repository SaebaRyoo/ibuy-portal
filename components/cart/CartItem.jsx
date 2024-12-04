import Link from 'next/link'

import { formatNumber } from 'utils'

import { SpecialSell, CartButtons, Icons, DiscountCartItem, ResponsiveImage } from 'components'

const CartItem = props => {
  // Props
  const { item } = props

  // Render
  return (
    <article className="flex px-4 py-5 space-x-4 ">
      {/* image & cartButtons */}
      <div className="space-y-4">
        <ResponsiveImage dimensions="w-28 h-28" src={item.image} alt={item.name} />

        <div className="mx-auto w-fit ">
          <SpecialSell discount={1} inStock={item.num} />
        </div>

        <CartButtons item={item} />
      </div>

      {/* name */}
      <div>
        <h5 className="mb-3 text-sm">
          <Link href={`/products/item?spuId=${item.spuId}&skuId=${item.skuId}`}>{item.name}</Link>
        </h5>

        {/* info */}
        <div className="space-y-3">
          <div className="flex items-center gap-x-2">
            <Icons.ShieldCheck className="icon" />
            <span className="font-light">正品保证和发货保证</span>
          </div>
          <div className="flex items-center gap-x-2">
            <Icons.Save className="icon text-sky-400" />
            <span className="font-light">仓库有售</span>
          </div>
          {item.discount > 0 ? (
            <DiscountCartItem discount={item.discount} price={item.price} />
          ) : (
            <div className="flex items-center gap-x-2">
              <span className="text-sm text-gray-700">{formatNumber(item.price)}</span>
              <span className="">¥</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default CartItem
