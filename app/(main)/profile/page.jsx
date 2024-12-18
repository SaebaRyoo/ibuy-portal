'use client'

import { Orders, ProfileAside } from '@/components'
import { useTitle } from '@/hooks'
import { siteTitle } from '@/utils'

export default function ProfilePage() {
  useTitle(`${siteTitle}-用户中心`)

  return (
    <>
      <div className="lg:hidden">
        <ProfileAside />
      </div>
      {/* <div className="hidden lg:block"><Orders /></div> */}
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <img src="https://placehold.co/80x80" alt="用户头像" className="rounded-full" />
            <div className="ml-4">
              <h1 className="text-xl font-semibold">弱冠有余</h1>
              <p className="text-gray-500">我的账号 | lxxnbnq | 收货地址</p>
              <p className="text-cPink">淘宝双12 大额盲拍，抢先领</p>
            </div>
          </div>

          <div className="grid grid-cols-5 text-center mb-6">
            <a className="group">
              <p className="text-lg group-hover:text-cPink transition">0</p>
              <p className="text-gray-500 group-hover:text-cPink transition">付款</p>
            </a>
            <a className="group">
              <p className="text-lg group-hover:text-cPink transition">0</p>
              <p className="text-gray-500 group-hover:text-cPink transition">发货</p>
            </a>
            <a className="group">
              <p className="text-lg group-hover:text-cPink transition">1</p>
              <p className="text-gray-500 group-hover:text-cPink transition">待收货</p>
            </a>
            <a className="group">
              <p className="text-lg group-hover:text-cPink transition">4</p>
              <p className="text-gray-500 group-hover:text-cPink transition">待评价</p>
            </a>
            <a className="group">
              <p className="text-lg group-hover:text-cPink transition">0</p>
              <p className="text-gray-500 group-hover:text-cPink transition">退款/售后</p>
            </a>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h2 className="text-lg font-semibold mb-2">我的物流</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-4">
              <img src="https://placehold.co/80x80" alt="物流信息" className="rounded mr-4" />
              <div>
                <p className="text-gray-800">
                  您的快件已签收，签收人位于[代收点](2期代收点)领取，如有疑问请联系站点：18952889702，…
                </p>
                <p className="text-gray-500 text-sm">2024-12-08 19:17:41 查看物流信息</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
