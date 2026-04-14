'use client'

import { ResponsiveImage } from 'components'
import useCountdown from '@/hooks/useCountdown'
import { useGetAlipayUrlMutation } from '@/store/services'
import { formatNumber } from 'utils'
import moment from 'moment-jalaali'

const OrderStatusMap = {
  '0': { label: '待支付', color: 'bg-amber-500' },
  '1': { label: '已支付', color: 'bg-green-500' },
  '2': { label: '已关闭', color: 'bg-gray-400' },
}

const PayCountdown = ({ createTime }) => {
  const payDeadline = new Date(new Date(createTime).getTime() + 5 * 60 * 1000)
  const { minutes, seconds, isExpired } = useCountdown(payDeadline)

  if (isExpired) return <span className="text-xs text-gray-400">已超时</span>

  return (
    <span className="text-xs text-amber-600 font-mono">
      剩余 {minutes}:{seconds}
    </span>
  )
}

const SeckillOrderCard = ({ order }) => {
  const status = OrderStatusMap[order.orderStatus] || OrderStatusMap['2']

  const [getAlipayUrl, { isLoading: paying }] = useGetAlipayUrlMutation()

  const handlePay = async () => {
    try {
      const result = await getAlipayUrl({
        orderId: order.id,
        queueName: 'SEC_KILL_ORDER_PAY',
      }).unwrap()

      if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('支付失败', err)
    }
  }

  return (
    <div className="py-4 space-y-3 border-b border-gray-200 lg:border lg:rounded-lg">
      <div className="flex items-center justify-between lg:px-3">
        <div className="flex items-center gap-x-2">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          <span className="text-sm text-black">{status.label}</span>
          {order.orderStatus === '0' && <PayCountdown createTime={order.createTime} />}
        </div>
        <span className="text-sm text-gray-400">
          {moment(order.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>

      <div className="flex flex-wrap justify-between lg:px-3">
        <div>
          <span className="text-gray-500">订单号:</span>
          <span className="ml-2 text-sm text-black">{order.id}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="text-xl font-bold text-red-600">¥{formatNumber(order.money)}</span>
          {order.orderStatus === '0' && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="px-4 py-1.5 bg-[#ff4757] text-white text-sm font-bold rounded hover:bg-[#ff6348] disabled:opacity-50"
            >
              {paying ? '跳转中...' : '去支付'}
            </button>
          )}
        </div>
      </div>

      {order.receiverAddress && (
        <div className="text-sm text-gray-500 lg:px-3">收货地址: {order.receiverAddress}</div>
      )}
    </div>
  )
}

export default SeckillOrderCard
