import React from 'react'

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-green-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12s4.03 9 9 9 9-4.03 9-9z"
            />
          </svg>
        </div>
        <h1 className="text-2xl text-gray-800 mb-2">恭喜您，支付成功啦！</h1>
        <p className="text-gray-600">支付方式：支付宝</p>
        <p className="text-gray-600">支付金额：¥1006.00元</p>
        <div className="mt-4">
          <button className="bg-red-600 text-white font-semibold rounded px-4 py-2 mr-2">
            查看订单
          </button>
          <button className="bg-gray-300 text-gray-800 font-semibold rounded px-4 py-2">
            继续购物
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
