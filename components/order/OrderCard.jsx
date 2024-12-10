import Link from 'next/link'

import moment from 'moment-jalaali'

import { HandleResponse, Icons, ResponsiveImage } from 'components'

import { formatNumber } from 'utils'

import { useUpdateOrderMutation, useGetOrderItemsQuery } from '@/store/services'

const OrderStatusMap = {
  0: '待付款',
  1: '待发货',
  2: '待收货',
  3: '待评价',
  4: '退款/售后',
  5: '交易完成',
  6: '交易关闭',
}

const OrderCard = props => {
  // Props
  const { order, singleOrder } = props

  // Edit Order Query
  const [editOrder, { data, isSuccess, isError, error }] = useUpdateOrderMutation()

  // Get Order Items Data
  const {
    data: orderItemsData,
    isSuccess: isOrderItemsSuccess,
    isError: isOrderItemsError,
  } = useGetOrderItemsQuery({
    id: order.id,
  })

  const orderItems = orderItemsData?.data || []

  // Handlers
  const handleChangeToDelivered = () => {
    editOrder({
      id: order.id,
      body: { paid: true, delivered: true },
    })
  }
  const handleChangeToInProccess = () => {
    editOrder({
      id: order.id,
      body: { paid: false, delivered: false },
    })
  }

  // Render
  return (
    <>
      {/* Handle Edit Order Response */}
      {(isSuccess || isError) && (
        <HandleResponse isError={isError} isSuccess={isSuccess} error={error} message={data?.msg} />
      )}
      <div className="py-4 space-y-3 border-b border-gray-200 lg:border lg:rounded-lg ">
        <div className="flex items-center justify-between lg:px-3">
          <div className="flex items-center gap-x-2 ">
            {order.delivered ? (
              <Icons.Check className="p-0.5 w-6 h-6 bg-lime-500 text-white rounded-full" />
            ) : (
              <Icons.Clock2 className="p-0.5 w-6 h-6 bg-amber-500 text-white rounded-full" />
            )}
            <span className="text-sm text-black">{OrderStatusMap[order.orderStatus]}</span>
          </div>
          {order.delivered && (
            <span className="">{moment(order.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          )}
          {singleOrder && (
            <div className="relative h-fit px-1.5 group self-end">
              <Icons.More className="cursor-pointer icon" />
              <div className="absolute left-0 z-10 hidden px-4 py-3 bg-white rounded shadow-3xl top-5 group-hover:flex">
                <div className="space-y-4">
                  <button
                    type="button"
                    className="flex items-center w-48 gap-x-3 lg:w-56"
                    onClick={handleChangeToDelivered}
                    disabled={order.delivered}
                  >
                    <Icons.Check className="text-white rounded-full p-0.5 icon bg-green-500 " />
                    <span className="block">将状态更改为已交付</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center w-48 gap-x-3 lg:w-56"
                    onClick={handleChangeToInProccess}
                    disabled={!order.delivered}
                  >
                    <Icons.Clock2 className="text-white rounded-full p-0.5 icon bg-amber-500 " />
                    <span className="block">将状态更改为处理中</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-between lg:px-3">
          <div>
            <span>订单号:</span>
            <span className="ml-2 text-sm text-black">{order.id}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <span className="text-xl font-bold text-red-600">
              总价：￥{formatNumber(order.payMoney)}
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-wrap py-5 gap-x-5 gap-y-3 lg:border-t lg:border-gray-200 lg:px-3">
          {orderItems.map((orderItem, index) => (
            <Link
              href={`/products/item?spuId=${orderItem.spuId}&skuId=${orderItem.skuId}`}
              key={index}
            >
              <div key={orderItem.id} className="flex border border-gray-300 rounded p-4">
                <ResponsiveImage
                  dimensions="w-16 h-16"
                  src={orderItem.image}
                  alt={orderItem.name}
                />
                <div className="ml-4 flex-grow">
                  <h2 className="text-sm font-semibold mb-1">{orderItem.name}</h2>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">单价：￥{orderItem.price}</span>
                    <span className="text-gray-500">×{orderItem.num}</span>
                  </div>
                  <p className="text-sm font-bold text-red-600">
                    实付款：￥{formatNumber(order.payMoney)}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">{orderItem.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default OrderCard
