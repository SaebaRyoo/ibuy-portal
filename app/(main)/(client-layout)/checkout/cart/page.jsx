'use client'
import { Fragment } from 'react'
import { useRouter } from 'next/navigation'

import { Icons, CartItem, CartInfo, Header, RedirectToLogin, Button, EmptyCart } from 'components'
import { Menu, Transition, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import { formatNumber, BuyType } from 'utils'

import { useUserInfo, useDisclosure, useCartList } from 'hooks'

const CartPage = () => {
  const { push } = useRouter()

  const [isShowRedirectModal, redirectModalHandlers] = useDisclosure()

  // 获取用户信息
  const { userInfo } = useUserInfo()

  const { cartData } = useCartList()

  // 处理路由跳转
  const handleRoute = () => {
    if (!userInfo) return redirectModalHandlers.open()

    push(`/checkout/shipping?buyType=${BuyType.cart}`)
  }

  // 删除全部商品的下拉菜单
  const DeleteAllDropDown = () => (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
        <Icons.More className="icon" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 w-32 mt-2 space-y-2 bg-white rounded-md shadow-lg">
          <MenuItem>
            <button className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100">
              <Icons.Delete className="icon" />
              <span>删除全部</span>
            </button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  )

  // 购物车为空时的展示
  if (!cartData?.data || cartData?.data.length === 0) {
    return (
      <section className="py-10 mx-auto mb-20 space-y-3 container lg:px-5 lg:mt-6">
        <div className="text-center space-y-4">
          <EmptyCart className="mx-auto h-52 w-52" />
          <p className="text-xl font-bold">您的购物车是空的！</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <RedirectToLogin
        title="您还没有登录"
        text="请登录后继续购物"
        onClose={redirectModalHandlers.close}
        isShow={isShowRedirectModal}
      />
      <main className="container py-2 mx-auto mb-20 xl:mt-36 lg:py-0 lg:mb-0 lg:px-5 lg:mt-6 lg:flex lg:flex-wrap lg:gap-x-3 lg:space-y-0">
        <div className="lg:py-4 lg:border lg:border-gray-200 lg:rounded-md lg:flex-1 h-fit">
          {/* title */}
          <section className="flex justify-between px-4">
            <div>
              <h3 className="mb-2 text-sm font-bold">您的购物车</h3>
              <span>{formatNumber(cartData?.totalItems)} 件商品</span>
            </div>
            <DeleteAllDropDown />
          </section>

          {/* 购物车列表 */}
          <section className="divide-y">
            {cartData?.data?.map(item => <CartItem item={item} key={item.itemID} />)}
          </section>
        </div>

        <div className="section-divide-y lg:hidden" />

        {/* 购物车信息 */}
        <section className="lg:sticky lg:top-6 lg:h-fit xl:top-36">
          <div className="lg:border lg:border-gray-200 lg:rounded-md">
            <CartInfo handleRoute={handleRoute} cart />
          </div>
        </section>

        {/* 底部固定按钮 */}
        <section className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-300 shadow-lg lg:hidden">
          <div>
            <span className="font-light">总计</span>
            <div className="flex items-center">
              <span className="text-sm">{formatNumber(cartData?.totalPrice)}</span>
              <span className="ml-1">¥</span>
            </div>
          </div>
          <Button className="w-1/2 py-2" onClick={handleRoute}>
            继续
          </Button>
        </section>
      </main>
    </>
  )
}

export default CartPage
