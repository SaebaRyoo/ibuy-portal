import React, { useState } from 'react'

import { AddressModal, HandleResponse, ConfirmDeleteModal } from '@/components'
import { useDisclosure } from '@/hooks'
import { useDeleteAddressMutation } from '@/store/services'

const AddressTable = ({ dataSource, refetch }) => {
  // Modals
  const [isShowConfirmDeleteModal, confirmDeleteModalHandlers] = useDisclosure()
  const [isShowAddressModal, addressModalHandlers] = useDisclosure()
  const [editedAddress, editedAddressHandler] = useState(null)

  // Queries
  const [
    deleteAddress,
    {
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
      data: dataDelete,
      isLoading: isLoadingDelete,
    },
  ] = useDeleteAddressMutation()

  const handleOpenEditAddressModal = address => {
    editedAddressHandler(address)
    addressModalHandlers.open()
  }

  const handleOpenDeleteAddressModal = address => {
    editedAddressHandler(address)
    confirmDeleteModalHandlers.open()
  }

  const onConfirmDelete = async () => {
    await deleteAddress(editedAddress.id)
    refetch()
  }

  const onCancelDelete = () => {
    editedAddressHandler(null)
    confirmDeleteModalHandlers.close()
  }

  const onSuccessDelete = () => {
    confirmDeleteModalHandlers.close()
    editedAddressHandler(null)
  }

  const onErrorDelete = () => {
    confirmDeleteModalHandlers.close()
    editedAddressHandler(null)
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
      {dataSource && dataSource.length > 0 && (
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
                  <button
                    onClick={() => handleOpenDeleteAddressModal(address)}
                    className="text-red-600 hover:text-red-800 font-medium ml-4 transition-colors"
                  >
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
      )}

      <ConfirmDeleteModal
        title="删除地址"
        isLoading={isLoadingDelete}
        isShow={isShowConfirmDeleteModal}
        onClose={confirmDeleteModalHandlers.close}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
      {/* Handle Delete Response */}
      {(isSuccessDelete || isErrorDelete) && (
        <HandleResponse
          isError={isErrorDelete}
          isSuccess={isSuccessDelete}
          error={errorDelete?.data?.message}
          message={dataDelete?.message}
          onSuccess={onSuccessDelete}
          onError={onErrorDelete}
        />
      )}
      {isShowAddressModal && (
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
      )}
    </div>
  )
}

export default AddressTable
