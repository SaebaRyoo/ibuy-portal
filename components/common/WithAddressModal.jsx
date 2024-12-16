import React from 'react'

import { AddressModal } from 'components'

import { useDisclosure, useUserInfo } from 'hooks'

const WithAddressModal = props => {
  const { children, address, handleConfirm } = props

  const [isShowAddressModal, addressModalHandlers] = useDisclosure()

  const addressModalProps = {
    openAddressModal: addressModalHandlers.open,
    address: address ?? {},
    isAddress: !!address,
  }

  return (
    <>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              addressModalProps,
            })
          : child
      )}

      <AddressModal
        isShow={isShowAddressModal}
        onClose={addressModalHandlers.close}
        address={address ?? {}}
        handleConfirm={handleConfirm}
      />
    </>
  )
}

export default WithAddressModal
