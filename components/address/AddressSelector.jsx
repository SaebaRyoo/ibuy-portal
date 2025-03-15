import React, { useState, useEffect } from 'react'
import { AddressModal } from '@/components'
import { RadioGroup, Radio } from '@headlessui/react'
import { useGetAddressListQuery } from '@/store/services'
import { useAppDispatch, useAppSelector, useDisclosure } from '@/hooks'
import { setCurAddress } from '@/store'
import Link from 'next/link'

const AddressSelector = () => {
  const dispatch = useAppDispatch()
  const [isShowAddressModal, addressModalHandlers] = useDisclosure()
  const selectedAddress = useAppSelector(state => state.address.currentSelectedAddress)
  const [showMore, setShowMore] = useState(false)

  const { data, isSuccess, isFetching, error, isError, refetch } = useGetAddressListQuery(null)

  //  初始化选中排在第一的默认地址
  useEffect(() => {
    if (isSuccess) {
      handleAddressSelect(data.data[0])
    }
  }, [isSuccess, data])

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const handleAddressSelect = selectedAddress => {
    dispatch(setCurAddress(selectedAddress))
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">确认收货地址</h2>
        <div className="flex gap-2">
          <a className="text-sm hover:text-cPink" onClick={addressModalHandlers.open}>
            新增地址
          </a>

          <Link href="/profile/addresses" className="text-sm hover:text-cPink">
            管理地址
          </Link>
        </div>
      </div>
      <RadioGroup value={selectedAddress} onChange={handleAddressSelect}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {data?.data?.slice(0, showMore ? data?.data?.length : 3).map(item => (
            <Radio key={item.id} value={item}>
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:border-cPink ${
                  selectedAddress?.id === item.id ? 'border-cPink bg-red-50' : 'border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{item.address}</div>
                {/* <div className="text-sm text-gray-600">{item.detail}</div> */}
                <div className="text-sm text-gray-500">
                  {item.contact} {item.phone}
                </div>
              </div>
            </Radio>
          ))}
        </div>
      </RadioGroup>

      <button className="mt-4 hover:text-cPink text-sm px-4 py-2 rounded" onClick={toggleShowMore}>
        {showMore ? '收起地址' : '显示更多地址'}
      </button>

      <AddressModal
        isShow={isShowAddressModal}
        onClose={addressModalHandlers.close}
        address={null}
        handleConfirm={() => {
          refetch()
        }}
      />
    </div>
  )
}

export default AddressSelector
