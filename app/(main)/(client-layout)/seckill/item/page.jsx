'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ImageGallery, AddressSelector } from 'components'
import useCountdown from '@/hooks/useCountdown'
import { useUrlQuery } from '@/hooks'
import {
  useGetActiveActivityQuery,
  useGetSeckillGoodsQuery,
  usePlaceSeckillOrderMutation,
} from '@/store/services'
import { useAppSelector } from '@/hooks'
import { formatNumber } from 'utils'

const SeckillItemPage = () => {
  const router = useRouter()
  const query = useUrlQuery()
  const goodsId = query?.id?.toString() ?? ''
  const selectedAddress = useAppSelector(state => state.address.currentSelectedAddress)

  const { data: activities } = useGetActiveActivityQuery()
  const activity = activities?.[0]
  const { data: goodsList } = useGetSeckillGoodsQuery(
    { activityId: activity?.id },
    { skip: !activity }
  )
  const goods = goodsList?.find(g => g.id === goodsId)

  const { hours, minutes, seconds, isExpired } = useCountdown(activity?.endTime)

  const [placeSeckillOrder, { isLoading: isOrdering }] = usePlaceSeckillOrderMutation()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const soldOut = goods?.stockCount === 0
  const soldPercent =
    goods && goods.totalStock > 0
      ? Math.round(((goods.totalStock - goods.stockCount) / goods.totalStock) * 100)
      : 0

  const handleSeckill = async () => {
    if (!selectedAddress) {
      toast.error('请先选择收货地址')
      return
    }

    try {
      setOrderPlaced(true)
      const result = await placeSeckillOrder({
        seckillGoodsId: goodsId,
        activityId: activity.id,
        receiverAddress: `${selectedAddress.address} ${selectedAddress.contact} ${selectedAddress.phone}`,
      }).unwrap()

      toast.success('秒杀成功！正在跳转订单页...')
      router.push('/profile/orders?activeKey=seckill')
    } catch (err) {
      toast.error(err?.message || '秒杀失败，请重试')
      setOrderPlaced(false)
    }
  }

  const getButtonState = () => {
    if (orderPlaced || isOrdering)
      return { text: '排队中...', disabled: true, className: 'bg-amber-500 cursor-not-allowed' }
    if (isExpired)
      return { text: '活动已结束', disabled: true, className: 'bg-gray-400 cursor-not-allowed' }
    if (soldOut)
      return { text: '已售罄', disabled: true, className: 'bg-gray-400 cursor-not-allowed' }
    return { text: '立即秒杀', disabled: false, className: 'cursor-pointer' }
  }

  const btn = getButtonState()

  if (!goods) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center text-gray-500">加载中...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-4 space-y-8">
      <div className="lg:grid lg:grid-cols-9 lg:gap-x-6 lg:px-6 lg:py-6">
        {/* 左侧：商品图片 */}
        <div className="lg:col-span-5">
          <ImageGallery
            images={goods.skuImage ? [goods.skuImage] : []}
            discount={0}
            inStock={goods.stockCount}
            productName={goods.skuName}
          />
        </div>

        {/* 右侧：商品信息 + 秒杀操作 */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800 leading-snug">{goods.skuName}</h1>

          {/* 秒杀价格区 */}
          <div className="bg-[#fff5f5] border border-[#ffd0d0] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#ff4757] text-white text-xs font-bold px-2 py-0.5 rounded">
                秒杀价
              </span>
              {!isExpired && (
                <div className="flex items-center gap-1 text-xs text-[#ff4757]">
                  <span>距结束</span>
                  <span className="bg-[#ff4757] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    {hours}
                  </span>
                  :
                  <span className="bg-[#ff4757] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    {minutes}
                  </span>
                  :
                  <span className="bg-[#ff4757] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    {seconds}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#ff4757]">
                ¥{formatNumber(goods.seckillPrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                原价 ¥{formatNumber(goods.skuPrice)}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>已抢 {soldPercent}%</span>
                <span>仅剩 {goods.stockCount} 件</span>
              </div>
              <div className="relative h-3 bg-[#ffd0d0] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${soldPercent}%`,
                    background: 'linear-gradient(90deg, #ff4757, #ff6348)',
                  }}
                />
              </div>
            </div>
          </div>

          <AddressSelector />

          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="text-amber-500">⚠</span>
            每人限购 1 件 · 下单后 5 分钟内未支付将自动取消
          </div>

          <button
            onClick={handleSeckill}
            disabled={btn.disabled}
            className={`w-full py-3.5 rounded-lg text-lg font-bold text-white tracking-wider ${btn.className}`}
            style={
              !btn.disabled
                ? { background: 'linear-gradient(135deg, #ff4757, #ff6348)' }
                : undefined
            }
          >
            {btn.text}
          </button>
        </div>
      </div>
    </main>
  )
}

export default SeckillItemPage
