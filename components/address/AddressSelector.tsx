import React, { useState } from 'react'
import { WithAddressModal } from '@/components'
import { RadioGroup } from '@headlessui/react'

const addresses = [
  {
    id: 1,
    title: '江苏省 镇江市 句容市 枫山街道',
    detail: '硕八路翰苑（二期）312栋102室',
    contact: '朱青源 15189186748',
    selected: true,
  },
  {
    id: 2,
    title: '上海市 淮海区 海湾镇',
    detail: '云楣路198弄诚正信苑9号501',
    contact: '朱青源 15189186748',
    selected: false,
  },
  {
    id: 3,
    title: '上海市 淮海区 海湾镇',
    detail: '石楠路沈悦道21号201',
    contact: '朱青源 15189186748',
    selected: false,
  },
  {
    id: 4,
    title: '北京市 海淀区 中关村',
    detail: '中关村东路66号',
    contact: '李四 13800138000',
  },
  {
    id: 5,
    title: '广东省 深圳市 南山区',
    detail: '科技园路5号',
    contact: '王五 13900139000',
  },
]

const AddressSelectorContent = () => {
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0].id)
  const [showMore, setShowMore] = useState(false)

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">确认收货地址</h2>
        <div className="flex gap-2">
          <a className="text-sm hover:bg-blue-100 px-2 py-1 rounded" onClick={() => {}}>
            新增地址
          </a>
          <a className="text-sm hover:bg-blue-100 px-2 py-1 rounded" onClick={() => {}}>
            管理地址
          </a>
        </div>
      </div>
      <RadioGroup value={selectedAddressId} onChange={setSelectedAddressId}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {addresses.slice(0, showMore ? addresses.length : 3).map(address => (
            <RadioGroup.Option key={address.id} value={address.id}>
              {({ checked }) => (
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    checked ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{address.title}</div>
                  <div className="text-sm text-gray-600">{address.detail}</div>
                  <div className="text-sm text-gray-500">{address.contact}</div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <button
        className="mt-4 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded"
        onClick={toggleShowMore}
      >
        {showMore ? '收起地址' : '显示更多地址'}
      </button>
    </div>
  )
}

const AddressSelector = () => {
  return (
    <WithAddressModal>
      <AddressSelectorContent />
    </WithAddressModal>
  )
}

export default AddressSelector
