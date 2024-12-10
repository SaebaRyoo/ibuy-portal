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
} from 'components'

import { useGetOrdersQuery } from '@/store/services'

import { useTitle, useUrlQuery } from '@/hooks'
import { useState } from 'react'

const Orders = () => {
  useTitle('订单管理')
  // Assets
  const query = useUrlQuery()
  const changeRoute = useChangeRoute()

  // state
  const [activeTab, setActiveTab] = useState(query.activeKey)

  // Get Orders Data
  const { data, isSuccess, isFetching, error, isError, refetch } = useGetOrdersQuery({
    pageSize: 5,
    current: query.page ? +query.page : 1,
    orderStatus: activeTab === 'all' ? undefined : activeTab,
  })

  const orders = data?.data?.data || []
  const total = data?.data?.total || 0

  // function
  const handleTabChange = index => {
    console.log(`Active tab index: ${index}`)
    changeRoute({ activeKey: index })
    setActiveTab(index) // 更新父组件中的 activeTab
  }

  // Render
  return (
    <main id="profileOrders">
      {/* <PageContainer title="订单历史"> */}

      <Tabs currentActiveKey={activeTab} onTabChange={handleTabChange}>
        <Tabs.TabPane activeKey="all" label="所有订单"></Tabs.TabPane>
        <Tabs.TabPane activeKey="0" label="待付款"></Tabs.TabPane>
        <Tabs.TabPane activeKey="1" label="待发货"></Tabs.TabPane>
        <Tabs.TabPane activeKey="2" label="待收货"></Tabs.TabPane>
        <Tabs.TabPane activeKey="3" label="待评价"></Tabs.TabPane>
        <Tabs.TabPane activeKey="4" label="退款/售后"></Tabs.TabPane>
      </Tabs>

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

      {total > 5 && (
        <div className="py-4 mx-auto lg:max-w-5xl">
          <Pagination
            pagination={data?.data?.pagination}
            changeRoute={changeRoute}
            section="profileOrders"
            client
          />
        </div>
      )}
      {/* </PageContainer> */}
    </main>
  )
}
export default Orders
