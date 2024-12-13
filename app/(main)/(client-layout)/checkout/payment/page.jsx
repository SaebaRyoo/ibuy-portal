'use client'

import { useEffect, useState } from 'react'
import { useGetAlipayStatusMutation } from '@/store/services'
import { useUrlQuery } from '@/hooks'

const PayConfirmPage = () => {
  // Assets
  const query = useUrlQuery()

  const orderId = query?.orderId?.toString() ?? ''
  // Mutations
  const [getAlipayStatus, { data, isSuccess, isError, isLoading, error }] =
    useGetAlipayStatusMutation()

  // States
  const [tradeStatus, setTradeStatus] = useState(null)
  const [pollingTime, setPollingTime] = useState(0) // Time spent polling in seconds

  useEffect(() => {
    let intervalId = null

    // Function to fetch and handle data
    const fetchStatus = async () => {
      try {
        const response = await getAlipayStatus({ orderId })
        const status = response?.data?.data?.tradeStatus

        setTradeStatus(status)

        // Stop polling on certain statuses
        if (['TRADE_CLOSED', 'TRADE_SUCCESS', 'TRADE_FINISHED'].includes(status)) {
          if (intervalId) clearInterval(intervalId)
        }
      } catch (err) {
        console.error('Error fetching payment status:', err)
      }
    }

    // Start polling
    if (!['TRADE_CLOSED', 'TRADE_SUCCESS', 'TRADE_FINISHED'].includes(tradeStatus)) {
      intervalId = setInterval(() => {
        setPollingTime(prev => prev + 5) // Increment polling time
        fetchStatus()
      }, 5000)
    }

    // Stop polling after 30 minutes
    if (pollingTime >= 30 * 60) {
      if (intervalId) clearInterval(intervalId)
    }

    return () => {
      if (intervalId) clearInterval(intervalId) // Clean up on unmount
    }
  }, [tradeStatus, pollingTime, getAlipayStatus])

  // Render based on tradeStatus
  const renderContent = () => {
    switch (tradeStatus) {
      case 'WAIT_BUYER_PAY':
        return <p>交易创建，等待买家付款...</p>
      case 'TRADE_CLOSED':
        return <p>交易关闭，未付款超时或已全额退款。</p>
      case 'TRADE_SUCCESS':
        return (
          <div>
            <p>支付成功！</p>
            <p>交易号: {data?.data?.tradeNo}</p>
            <p>支付金额: ¥{data?.data?.totalAmount}</p>
            <p>买家账号: {data?.data?.buyerLogonId}</p>
          </div>
        )
      case 'TRADE_FINISHED':
        return <p>交易完成，不可退款。</p>
      default:
        return <p>正在确认支付状态，请稍候...</p>
    }
  }

  return (
    <div className="py-2 mx-auto">
      <h1 className="text-xl font-semibold">支付状态确认</h1>
      {isLoading && <p>正在加载...</p>}
      {isError && <p>请求出错，请稍后重试。</p>}
      {renderContent()}
    </div>
  )
}

export default PayConfirmPage
