'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAlipayStatusMutation } from '@/store/services'
import { useUrlQuery } from '@/hooks'
import { Icons } from 'components'

const PayConfirmPage = () => {
  const { push } = useRouter()
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

  // 状态图标组件
  const StatusIcon = ({ status }) => {
    const iconClass = 'w-10 h-10' // 图标基础尺寸

    switch (status) {
      case 'TRADE_SUCCESS':
        return (
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-25"></div>
            <div className="relative flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <Icons.CheckCircle className={`${iconClass} text-green-500`} />
            </div>
          </div>
        )
      case 'TRADE_CLOSED':
        return (
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <Icons.XCircle className={`${iconClass} text-red-500`} />
          </div>
        )
      case 'WAIT_BUYER_PAY':
        return (
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full animate-pulse">
            <Icons.Time className={`${iconClass} text-blue-500`} />
          </div>
        )
      case 'TRADE_FINISHED':
        return (
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
            <Icons.Package className={`${iconClass} text-gray-500`} />
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
            <Icons.LoaderCircle className={`${iconClass} text-gray-500 animate-spin`} />
          </div>
        )
    }
  }

  // Render based on tradeStatus
  const renderContent = () => {
    const cardStyles = {
      TRADE_SUCCESS: 'border-green-200 bg-green-50',
      TRADE_CLOSED: 'border-red-200 bg-red-50',
      WAIT_BUYER_PAY: 'border-blue-200 bg-blue-50',
      TRADE_FINISHED: 'border-gray-200 bg-gray-50',
    }

    if (isError) {
      return (
        <div className="rounded-lg bg-red-50 p-4 text-center mb-6">
          <Icons.XCircle className="mx-auto h-10 w-10 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-red-800">请求出错</h3>
          <p className="mt-1 text-sm text-red-600">请稍等</p>
        </div>
      )
    }

    // 如果正在加载且没有状态，显示"确认中"状态
    if (isLoading && !tradeStatus) {
      return (
        <div className="rounded-lg border-2 p-6 border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
              <Icons.LoaderCircle className="w-10 h-10 text-gray-500 animate-spin" />
            </div>
            <div className="flex-1">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">确认中</h2>
                <p className="text-sm text-gray-600 mt-1">正在确认支付状态，请稍候...</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`rounded-lg border-2 p-6 ${cardStyles[tradeStatus] || 'border-gray-200 bg-gray-50'}`}
      >
        <div className="flex items-center space-x-6">
          <StatusIcon status={tradeStatus} />
          <div className="flex-1">
            {tradeStatus === 'WAIT_BUYER_PAY' && (
              <div>
                <h2 className="text-xl font-semibold text-blue-700">等待付款</h2>
                <p className="text-sm text-blue-600 mt-1">交易创建，等待买家付款</p>
              </div>
            )}
            {tradeStatus === 'TRADE_CLOSED' && (
              <div>
                <h2 className="text-xl font-semibold text-red-700">交易关闭</h2>
                <p className="text-sm text-red-600 mt-1">未付款超时或已全额退款</p>
              </div>
            )}
            {tradeStatus === 'TRADE_SUCCESS' && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-700">支付成功</h2>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    交易号：<span className="font-mono">{data?.data?.tradeNo}</span>
                  </p>
                  <p>
                    支付金额：<span className="font-semibold">¥{data?.data?.totalAmount}</span>
                  </p>
                  <p>买家账号：{data?.data?.buyerLogonId}</p>
                </div>
              </div>
            )}
            {tradeStatus === 'TRADE_FINISHED' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">交易完成</h2>
                <p className="text-sm text-gray-600 mt-1">交易完成，不可退款</p>
              </div>
            )}
            {!tradeStatus && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">确认中</h2>
                <p className="text-sm text-gray-600 mt-1">正在确认支付状态，请稍候...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[50vh] py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">支付状态确认</h1>
          {pollingTime > 0 && pollingTime < 30 * 60 && (
            <p className="text-sm text-gray-500 mt-2">
              已等待 ({Math.floor(pollingTime / 60)}分{pollingTime % 60}秒)
            </p>
          )}
        </div>

        {/* 始终显示内容，避免闪烁 */}
        {renderContent()}

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => push('/profile/orders')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            查看订单
          </button>
          <button
            onClick={() => push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}

export default PayConfirmPage
