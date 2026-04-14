'use client'
import { useChangeRoute } from 'hooks'

import {
  OrderCard,
  Pagination,
  ShowWrapper,
  EmptyOrdersList,
  PageContainer,
  OrderSkeleton,
  Tabs,
  SeckillOrderCard,
} from 'components'

import { useGetOrdersQuery, useGetSeckillOrdersMutation } from '@/store/services'

import { useTitle, useUrlQuery } from '@/hooks'
import { useState, useEffect } from 'react'

const Orders = () => {
  useTitle('订单管理')
  const query = useUrlQuery()
  const changeRoute = useChangeRoute()

  const [activeTab, setActiveTab] = useState(query.activeKey || 'all')

  const isSeckillTab = activeTab === 'seckill'

  // 普通订单
  const { data, isSuccess, isFetching, error, isError, refetch } = useGetOrdersQuery(
    {
      pageSize: 5,
      current: query.page ? +query.page : 1,
      orderStatus: activeTab === 'all' ? undefined : activeTab,
    },
    { skip: isSeckillTab }
  )

  const orders = data?.items || []
  const total = data?.total || 0

  // 秒杀订单
  const [
    fetchSeckillOrders,
    {
      data: seckillData,
      isSuccess: seckillSuccess,
      isLoading: seckillLoading,
      error: seckillError,
      isError: seckillIsError,
    },
  ] = useGetSeckillOrdersMutation()

  useEffect(() => {
    if (isSeckillTab) {
      fetchSeckillOrders({ current: query.page ? +query.page : 1, pageSize: 5 })
    }
  }, [isSeckillTab, query.page])

  const seckillOrders = seckillData?.items || []
  const seckillTotal = seckillData?.total || 0

  const handleTabChange = index => {
    changeRoute({ activeKey: index })
    setActiveTab(index)
  }

  return (
    <main id="profileOrders">
      <Tabs currentActiveKey={activeTab} onTabChange={handleTabChange}>
        <Tabs.TabPane activeKey="all" label="所有订单"></Tabs.TabPane>
        <Tabs.TabPane activeKey="0" label="待付款"></Tabs.TabPane>
        <Tabs.TabPane activeKey="1" label="待发货"></Tabs.TabPane>
        <Tabs.TabPane activeKey="2" label="待收货"></Tabs.TabPane>
        <Tabs.TabPane activeKey="3" label="待评价"></Tabs.TabPane>
        <Tabs.TabPane activeKey="4" label="退款/售后"></Tabs.TabPane>
        <Tabs.TabPane activeKey="seckill" label="🔥秒杀订单"></Tabs.TabPane>
      </Tabs>

      {isSeckillTab ? (
        <ShowWrapper
          error={seckillError}
          isError={seckillIsError}
          refetch={() => fetchSeckillOrders({ current: 1, pageSize: 5 })}
          isFetching={seckillLoading}
          isSuccess={seckillSuccess}
          dataLength={seckillTotal}
          emptyComponent={<EmptyOrdersList />}
          loadingComponent={<OrderSkeleton />}
        >
          <div className="px-4 py-3 space-y-3">
            {seckillOrders.map(item => (
              <SeckillOrderCard key={item.id} order={item} />
            ))}
          </div>
        </ShowWrapper>
      ) : (
        <ShowWrapper
          error={error}
          isError={isError}
          refetch={refetch}
          isFetching={isFetching}
          isSuccess={isSuccess}
          dataLength={total}
          emptyComponent={<EmptyOrdersList />}
          loadingComponent={<OrderSkeleton />}
        >
          <div className="px-4 py-3 space-y-3">
            {orders.map(item => (
              <OrderCard key={item.id} order={item} />
            ))}
          </div>
        </ShowWrapper>
      )}
    </main>
  )
}
export default Orders
