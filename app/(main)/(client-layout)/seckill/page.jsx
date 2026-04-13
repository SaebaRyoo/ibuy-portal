'use client'

import { useUrlQuery } from '@/hooks'
import useCountdown from '@/hooks/useCountdown'
import { useGetActiveActivityQuery, useGetSeckillGoodsQuery } from '@/store/services'
import { SeckillCountdown, SeckillGoodsList } from 'components'

const SeckillPage = () => {
  const query = useUrlQuery()
  const activityIdFromUrl = query?.activityId?.toString()

  const { data: activities, isSuccess: activityLoaded } = useGetActiveActivityQuery()
  const activity = activityLoaded
    ? activityIdFromUrl
      ? activities?.find(a => a.id === activityIdFromUrl) || activities?.[0]
      : activities?.[0]
    : null

  const { data: goods, isLoading: goodsLoading } = useGetSeckillGoodsQuery(
    { activityId: activity?.id },
    { skip: !activity }
  )

  const { isExpired } = useCountdown(activity?.endTime)

  if (!activityLoaded) {
    return (
      <main className="min-h-screen container mx-auto py-8">
        <div className="text-center text-gray-500">加载中...</div>
      </main>
    )
  }

  if (!activity) {
    return (
      <main className="min-h-screen container mx-auto py-8">
        <div className="text-center text-gray-500 text-lg">暂无进行中的秒杀活动</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div
        className="py-5 px-8 flex items-center gap-6"
        style={{ background: 'linear-gradient(135deg, #ff4757, #ff6348)' }}
      >
        <div className="text-white">
          <div className="text-2xl font-bold">⚡ 限时秒杀</div>
          <div className="text-sm opacity-85 mt-1">
            {activity.name}{activity.intro ? ` · ${activity.intro}` : ''}
          </div>
        </div>
        {isExpired ? (
          <span className="text-white/80 text-sm font-bold">活动已结束</span>
        ) : (
          <SeckillCountdown endTime={activity.endTime} size="lg" />
        )}
      </div>

      <div className="bg-gray-100 py-6 px-8">
        {goodsLoading ? (
          <div className="text-center text-gray-400 py-12">加载商品中...</div>
        ) : goods?.length > 0 ? (
          <SeckillGoodsList goods={goods} disabled={isExpired} />
        ) : (
          <div className="text-center text-gray-400 py-12">暂无秒杀商品</div>
        )}
      </div>
    </main>
  )
}

export default SeckillPage
