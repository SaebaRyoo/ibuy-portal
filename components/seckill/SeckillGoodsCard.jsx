'use client'

import Link from 'next/link'
import { ResponsiveImage } from 'components'
import { formatNumber } from 'utils'

const SeckillGoodsCard = ({ goods, disabled = false }) => {
  const { id, skuName, skuImage, skuPrice, seckillPrice, stockCount, totalStock } = goods

  const soldOut = stockCount === 0
  const almostGone = stockCount > 0 && stockCount <= 5
  const soldPercent =
    totalStock > 0 ? Math.round(((totalStock - stockCount) / totalStock) * 100) : 0

  const cardContent = (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm min-w-[200px] max-w-[240px] flex-shrink-0 flex-1 transition-all duration-200 ${
        soldOut || disabled
          ? 'opacity-60 cursor-default'
          : 'cursor-pointer hover:-translate-y-1 hover:shadow-md'
      }`}
    >
      {/* 商品图片 */}
      <div className="relative h-[180px] bg-gray-100">
        {skuImage ? (
          <ResponsiveImage
            dimensions="w-full h-full"
            src={skuImage}
            alt={skuName}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            商品图片
          </div>
        )}
        {!soldOut && (
          <span className="absolute top-2 left-2 bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            秒杀
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-base font-bold border-2 border-white px-4 py-1 rounded">
              已售罄
            </span>
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-3">
        <div className="text-sm text-gray-800 mb-2 line-clamp-2 h-10 leading-5">{skuName}</div>
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-xl font-bold ${soldOut ? 'text-gray-400' : 'text-[#ff4757]'}`}>
            ¥{formatNumber(seckillPrice)}
          </span>
          <span className="text-xs text-gray-400 line-through">¥{formatNumber(skuPrice)}</span>
        </div>

        {/* 进度条 */}
        <div
          className="relative h-[18px] rounded-full overflow-hidden"
          style={{ background: soldOut ? '#eee' : '#ffe0e0' }}
        >
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${almostGone ? 'animate-pulse' : ''}`}
            style={{
              width: `${soldPercent}%`,
              background: soldOut ? '#999' : 'linear-gradient(90deg, #ff4757, #ff6348)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
            {soldOut ? '已售罄' : `已抢 ${soldPercent}%`}
          </div>
        </div>
      </div>
    </div>
  )

  if (soldOut || disabled) return cardContent

  return <Link href={`/seckill/item?id=${id}`}>{cardContent}</Link>
}

export default SeckillGoodsCard
