'use client'

import { useEffect, useState } from 'react'

import { useAddAddressMutation, useUpdateAddressMutation } from '@/store/services'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { addressSchema } from 'utils'

import regions from 'china-citys'

import {
  TextField,
  TextArea,
  DisplayError,
  SubmitModalBtn,
  Combobox,
  Modal,
  HandleResponse,
} from 'components'

const AddressModal = props => {
  // Porps
  const { isShow, onClose, handleConfirm, address } = props
  const isEdit = !!address

  // Assets
  let AllProvinces = regions.getProvinces()

  // State
  const [cities, setCities] = useState([])
  const [areas, setAreas] = useState([])

  // Form Hook
  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: address,
  })

  // 添加地址
  const [addAddress, { data, isSuccess, isLoading, isError, error }] = useAddAddressMutation()
  // 更新地址
  const [
    updateAddress,
    {
      data: updateData,
      isSuccess: isUpdateSuccess,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateAddressMutation()

  // Re-Renders
  //* Change cities beside on province
  useEffect(() => {
    setValue('area', {})
    getValues('city')?.code ? setAreas(regions.getAreasByCity(getValues('city')?.code)) : ''
    watch('city')
  }, [getValues('city')?.code])

  useEffect(() => {
    setValue('city', {})
    setCities(regions.getCitysByProvince(getValues('province')?.code))
    watch('province')
  }, [getValues('province')?.code])

  useEffect(() => {
    if (address) {
      console.log('address--->', address)
      // setValue('city', address.city)
      // setValue('area', address.area)
      // setValue('province', regions.getProvinceByCode(address.provinceId))
    }
  }, [address])

  // Handlers
  const submitHander = async editedAddress => {
    const _editedAddress = {
      contact: editedAddress.contact,
      phone: editedAddress.phone,
      address:
        editedAddress.province?.name +
        editedAddress.city?.name +
        editedAddress.area?.name +
        editedAddress.street,
      provinceId: editedAddress.province?.code,
      cityId: editedAddress.city?.code,
      areaId: editedAddress.area?.code,
      username: '',
      isDefault: 0, // 是否为默认地址
    }
    if (isEdit) {
      await updateAddress({
        ..._editedAddress,
        id: address.id,
      })
      onClose()
      handleConfirm()
    } else {
      await addAddress(_editedAddress)
      onClose()
      handleConfirm()
    }
  }

  // Render
  return (
    <>
      {/* Handle Add Address Response */}
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error?.data?.message}
          message={data?.message}
          onSuccess={onClose}
        />
      )}
      {(isUpdateSuccess || isUpdateError) && (
        <HandleResponse
          isError={isUpdateError}
          isSuccess={isUpdateSuccess}
          error={updateError?.data?.message}
          message={updateData?.message}
          onSuccess={onClose}
        />
      )}

      <Modal isShow={isShow} onClose={onClose} effect="bottom-to-top">
        <Modal.Content
          onClose={onClose}
          className="flex flex-col h-full px-5 py-3 bg-white md:rounded-lg gap-y-5 "
        >
          <Modal.Header onClose={onClose}>地址管理</Modal.Header>
          <Modal.Body>
            <p>请输入您的收货地址</p>
            <form
              className="flex flex-col justify-between flex-1 pl-4 overflow-y-auto"
              onSubmit={handleSubmit(submitHander)}
            >
              <div className="flex flex-col">
                <div className="flex space-x-4">
                  <div className="flex-1 ">
                    <Combobox
                      label="省份"
                      control={control}
                      name="province"
                      list={AllProvinces}
                      placeholder="请选择您所在的省份"
                    />
                    <DisplayError errors={formErrors.province?.name} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Combobox
                      label="城市"
                      control={control}
                      name="city"
                      list={cities}
                      placeholder="请选择您所在的城市"
                    />
                    <DisplayError errors={formErrors.city?.name} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Combobox
                      label="区县"
                      control={control}
                      name="area"
                      list={areas}
                      placeholder="请选择您所在的区县"
                    />
                    <DisplayError errors={formErrors.area?.name} />
                  </div>
                </div>

                <TextArea
                  label="详细地址"
                  control={control}
                  rows={2}
                  errors={formErrors.street}
                  name="street"
                />

                <TextField
                  label="收货人姓名"
                  control={control}
                  errors={formErrors.contact}
                  name="contact"
                  type="text"
                  direction="ltr"
                  inputMode="numeric"
                />
                <TextField
                  label="收货人电话"
                  control={control}
                  errors={formErrors.phone}
                  name="phone"
                  type="number"
                  direction="ltr"
                  inputMode="numeric"
                />
              </div>

              <div className="py-3 border-t-2 border-gray-200 lg:pb-0 flex">
                <SubmitModalBtn isLoading={isLoading} className="ml-auto">
                  确定
                </SubmitModalBtn>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default AddressModal
