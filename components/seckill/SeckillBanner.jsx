'use client'

import Link from 'next/link'
import { ResponsiveImage } from 'components'
import SeckillCountdown from './SeckillCountdown'
import { useGetActiveActivityQuery, useGetSeckillGoodsQuery } from '@/store/services'
import { formatNumber } from 'utils'

const SeckillBanner = () => {
  const { data: activities, isSuccess } = useGetActiveActivityQuery()

  const activity = isSuccess && activities?.length > 0 ? activities[0] : null

  const { data: goods } = useGetSeckillGoodsQuery({ activityId: activity?.id }, { skip: !activity })

  if (!activity) return null

  const previewGoods = (goods || []).slice(0, 3)

  return (
    <Link href={`/seckill?activityId=${activity.id}`}>
      <div
        className="rounded-xl p-5 flex items-center gap-6 cursor-pointer transition-shadow shadow-md hover:shadow-lg"
        style={{ background: 'linear-gradient(135deg, #ff4757, #ff6348)' }}
      >
        {/* 左侧：活动信息 + 倒计时 */}
        <div className="flex-1 text-white">
          <div className="text-xl font-bold mb-1">⚡ 限时秒杀</div>
          <div className="text-sm opacity-90 mb-3">
            {activity.name}
            {activity.intro ? ` · ${activity.intro}` : ''}
          </div>
          <SeckillCountdown endTime={activity.endTime} size="md" />
        </div>

        {/* 右侧：商品预览 */}
        <div className="hidden md:flex gap-2">
          {previewGoods.map(item => (
            <div key={item.id} className="bg-white/20 rounded-lg p-2 text-center w-[80px]">
              <div className="w-[56px] h-[56px] mx-auto mb-1 bg-white/30 rounded overflow-hidden">
                {item.skuImage && (
                  <ResponsiveImage
                    dimensions="w-full h-full"
                    src={item.skuImage}
                    alt={item.skuName}
                  />
                )}
              </div>
              <div className="text-xs font-bold text-white">¥{formatNumber(item.seckillPrice)}</div>
              <div className="text-[10px] text-white/70 line-through">
                ¥{formatNumber(item.skuPrice)}
              </div>
            </div>
          ))}
        </div>

        {/* 箭头 */}
        <div className="text-2xl text-white/60">›</div>
      </div>
    </Link>
  )
}

export default SeckillBanner
