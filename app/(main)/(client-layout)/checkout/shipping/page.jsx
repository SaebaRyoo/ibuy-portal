'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { showAlert } from 'store'

import { useCreateOrderFromCartListMutation, useGetAlipayUrlMutation } from '@/store/services'

import {
  Button,
  CartInfo,
  HandleResponse,
  Icons,
  ResponsiveImage,
  AddressSelector,
} from 'components'

import { AliPay, formatNumber, PayTypes } from 'utils'

import { useAppDispatch, useAppSelector, useUserInfo, useCartList } from 'hooks'

const ShippingPage = () => {
  // Assets
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { refetch: refetchCartList } = useCartList()

  // Get User Data
  const { userInfo } = useUserInfo()

  // States
  const [payType, setPaymentMethod] = useState(AliPay)

  // Store
  const { cartItems, totalItems, totalDiscount, totalPrice } = useAppSelector(state => state.cart)
  // get selected address from redux
  const currentSelectedAddress = useAppSelector(state => state.address.currentSelectedAddress)

  // Mutations
  // const [postData, { data, isSuccess, isError, isLoading, error }] = useCreateOrderMutation()
  const [createOrderFromCartList, { data, isSuccess, isError, isLoading, error }] =
    useCreateOrderFromCartListMutation()
  // 获取支付宝支付页面链接
  const [getAlipayUrl] = useGetAlipayUrlMutation()

  console.log('currentSelectedAddress: ', currentSelectedAddress)
  // Handlers
  const handleCreateOrder = async () => {
    // 1. 验证用户是否选择了地址
    if (!currentSelectedAddress) {
      return dispatch(
        showAlert({
          status: 'error',
          title: '请填写您的地址',
        })
      )
    }

    // 2. 调用创建订单接口
    const orderResult = await createOrderFromCartList({
      body: {
        receiverAddress: currentSelectedAddress.address,
        receiverMobile: currentSelectedAddress.phone,
        receiverContact: currentSelectedAddress.contact,
        payType,
      },
    })
    // 重新刷新一下购物车列表
    refetchCartList()
    // 3. 根据订单id 调用支付接口
    const orderId = orderResult?.data?.data?.id
    console.log('orderId: ', orderId)

    const alipayData = await getAlipayUrl({
      orderId: orderId,
      queueName: 'ORDER_PAY', // 正常支付
    })

    // 4. 根据alipayData.data.url 跳转到一个新的支付页面
    const alipayUrl = alipayData?.data?.data?.alipayUrl
    // if (payType === AliPay) {
    window.open(alipayUrl, '_blank')
    // }

    if (alipayUrl) {
      // 5. 跳转到支付状态查询页面
      router.push(`/checkout/payment?orderId=${orderId}`)
    }
  }

  // Render
  return (
    <>
      {/*  Handle Create Order Response */}
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error?.data?.message}
          message={data?.message}
          onSuccess={() => {
            router.push('/profile')
          }}
        />
      )}

      <main className="py-2 mx-auto space-y-3 container">
        {/* header */}
        <header className="lg:border lg:border-gray-200 lg:rounded-lg py-2">
          <div className="flex items-center justify-evenly">
            <Link href="/checkout/cart" className="flex flex-col items-center gap-y-2">
              <Icons.Cart className="text-red-300 icon" />
              <span className="font-normal text-red-300">购物车</span>
            </Link>

            <div className="h-[1px] w-8  bg-red-300" />
            <div className="flex flex-col items-center gap-y-2">
              <Icons.Wallet className="w-6 h-6 text-cPink icon" />
              <span className="text-base font-normal text-cPink">付款方式</span>
            </div>
          </div>
        </header>

        <div className="section-divide-y lg:hidden" />

        <div className="lg:flex lg:gap-x-3">
          <div className="lg:flex-1">
            {/* address */}
            <AddressSelector />

            <div className="section-divide-y lg:hidden" />

            {/* products */}
            <section className="px-2 py-4 mx-3 border border-gray-200 rounded-lg lg:mx-0 lg:mt-3 ">
              <div className="flex mb-5">
                <Image src="/icons/car.png" className="mr-4" width={40} height={40} alt="icon" />
                <div>
                  <span className="text-base text-black">正常发货</span>
                  <span className="block">有现货</span>
                </div>
                <span className="inline-block px-2 py-1 ml-3 bg-gray-100 rounded-lg h-fit">
                  {formatNumber(totalItems)} 件商品
                </span>
              </div>
              <div className="flex flex-wrap justify-start gap-x-8 gap-y-5">
                {cartItems.map(item => (
                  <article key={item.itemID}>
                    <ResponsiveImage dimensions="w-28 h-28" src={item.image} alt={item.name} />
                  </article>
                ))}
              </div>

              <Link href="/checkout/cart" className="inline-block mt-6 text-sm text-sky-500">
                返回购物车
              </Link>
            </section>
          </div>

          <div className="section-divide-y lg:hidden" />

          {/* cart info */}
          <section className="lg:border lg:border-gray-200 lg:rounded-md lg:h-fit">
            <CartInfo />
            <div className="px-3 py-2 space-y-3">
              {PayTypes.map(type => (
                <div className="flex items-center gap-x-2 ">
                  <input
                    type="radio"
                    name="zarinPal"
                    id="zarinPal"
                    value={type.value}
                    checked={payType === type.value}
                    onChange={e => setPaymentMethod(type.value)}
                  />
                  <label className="text-sm" htmlFor="zarinPal">
                    {type.name}
                  </label>
                </div>
              ))}
              <Button
                onClick={handleCreateOrder}
                isLoading={isLoading}
                className="w-full max-w-5xl mx-auto"
              >
                完成购买
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default ShippingPage
