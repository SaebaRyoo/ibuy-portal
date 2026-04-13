'use client'

import SeckillGoodsCard from './SeckillGoodsCard'

const SeckillGoodsList = ({ goods = [], disabled = false }) => {
  // 已售罄的排到末尾
  const sorted = [...goods].sort((a, b) => {
    if (a.stockCount === 0 && b.stockCount !== 0) return 1
    if (a.stockCount !== 0 && b.stockCount === 0) return -1
    return 0
  })

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
      {sorted.map(item => (
        <SeckillGoodsCard key={item.id} goods={item} disabled={disabled} />
      ))}
    </div>
  )
}

export default SeckillGoodsList
