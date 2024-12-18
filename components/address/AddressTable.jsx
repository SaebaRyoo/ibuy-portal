import React, { useState } from 'react'

import { AddressModal } from '@/components'
import { useDisclosure } from '@/hooks'

const AddressTable = ({ dataSource, refetch }) => {
  const [isShowAddressModal, addressModalHandlers] = useDisclosure()
  const [editedAddress, editedAddressHandler] = useState(null)

  const handleOpenEditAddressModal = address => {
    editedAddressHandler(address)
    addressModalHandlers.open()
  }

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">地址管理</h1>
        <button
          className="mb-2 bg-gray-100 px-6 py-3 rounded-lg transition-colors"
          onClick={addressModalHandlers.open}
        >
          添加地址
        </button>
      </div>
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gray-50 text-sm text-gray-700">
            <th className="px-6 py-4 text-left font-medium tracking-wide">收货人</th>
            <th className="px-6 py-4 text-left font-medium tracking-wide">电话/手机</th>
            <th className="px-6 py-4 text-left font-medium tracking-wide">地址</th>
            <th className="px-6 py-4 text-left font-medium tracking-wide">操作</th>
            <th className="px-6 py-4">移动设置</th>
          </tr>
        </thead>
        <tbody>
          {dataSource.map(address => (
            <tr
              key={address.id}
              className={`border-t bg-gray-50 text-xs hover:bg-gray-100 transition-colors`}
            >
              <td className="px-6 py-4 text-gray-700">{address.contact}</td>
              <td className="px-6 py-4 text-gray-700">{address.phone}</td>
              <td className="px-6 py-4 text-gray-700">{address.address}</td>
              <td className="px-6 py-4 text-center flex">
                <button
                  onClick={() => {
                    handleOpenEditAddressModal(address)
                  }}
                  className="text-sky-500 hover:text-sky-800 font-medium transition-colors"
                >
                  修改
                </button>
                <button className="text-red-600 hover:text-red-800 font-medium ml-4 transition-colors">
                  删除
                </button>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  className={`font-medium transition-colors ${address.isDefault ? 'text-orange-600 hover:text-orange-800' : ''}`}
                >
                  设为默认
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddressModal
        isShow={isShowAddressModal}
        onClose={() => {
          editedAddressHandler(null)
          addressModalHandlers.close()
        }}
        address={editedAddress}
        handleConfirm={() => {
          editedAddressHandler(null)
          refetch()
        }}
      />
    </div>
  )
}

export default AddressTable
