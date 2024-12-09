import { useDispatch } from 'react-redux'

import { Icons } from 'components'

import { formatNumber } from 'utils'

const CartButtons = props => {
  // Props
  const { item } = props

  // Assets
  const dispatch = useDispatch()

  // Render
  return (
    <div className="flex items-center py-2 text-sm rounded-md shadow-3xl justify-evenly">
      <button className="active:scale-90" type="button">
        <Icons.Plus className="text-red-500 icon" />
      </button>

      <span className="text-sm min-w-[22px] text-center">{formatNumber(item.num)}</span>

      {item.num === 1 ? (
        <button className="active:scale-90" type="button">
          <Icons.Delete className="text-red-500 icon" />
        </button>
      ) : (
        <button className="active:scale-90" type="button">
          <Icons.Minus className="text-red-500 icon" />
        </button>
      )}
    </div>
  )
}

export default CartButtons
