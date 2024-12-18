import { formatNumber } from 'utils'

const DiscountCartItem = props => {
  // Props
  const { discount, price } = props

  // Assets
  const discountPercent = discount / 100
  console.log('discountPercent', discountPercent)

  // Render
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <span className="text-cPink">{formatNumber(+(price * discountPercent).toFixed())}</span>

        <span className="text-cPink">¥</span>

        <span className="text-cPink">折扣</span>
      </div>
      <div className="flex items-center gap-x-2">
        <span className="text-sm text-gray-700">
          {formatNumber(price - (discount * price) / 100)}
        </span>
        <span className="">¥</span>
      </div>
    </div>
  )
}

export default DiscountCartItem
