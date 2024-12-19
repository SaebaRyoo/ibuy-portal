'use client'

import { useEffect, useState, useRef } from 'react'

import { useAddAddressMutation, useUpdateAddressMutation } from '@/store/services'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { addressSchema, regionUtils } from 'utils'

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
  const isInitialized = useRef(false)

  const isInitialized2 = useRef(false)

  // Assets
  let AllProvinces = regionUtils.getProvinces()

  // State
  const [cities, setCities] = useState(null)
  const [areas, setAreas] = useState(null)

  // Form Hook
  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    setValue,
    getValues,
    watch,
    reset,
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

  const selectedProvinceCode = getValues('province')?.province
  const selectedCityCode = getValues('city')?.city

  useEffect(() => {
    // setValue('area', {})
    if (selectedProvinceCode && selectedCityCode) {
      setAreas(regionUtils.getAreasByProvinceAndCity(selectedProvinceCode, selectedCityCode))
    }
    watch('city')
  }, [selectedProvinceCode, selectedCityCode])

  useEffect(() => {
    // setValue('city', {})
    setCities(regionUtils.getCitysByProvince(selectedProvinceCode))
    watch('province')
  }, [selectedProvinceCode])

  // 编辑地址时的数据回显
  useEffect(() => {
    if (address && !isInitialized.current) {
      isInitialized.current = true

      const initializeAddress = () => {
        // 设置城市
        const cities = regionUtils.getCitysByProvince(address.provinceId)
        setCities(cities)

        // 设置区域
        const areas = regionUtils.getAreasByProvinceAndCity(address.provinceId, address.cityId)
        setAreas(areas)
      }

      initializeAddress()
    }
  }, [address])

  useEffect(() => {
    if (address && cities && areas && !isInitialized2.current) {
      isInitialized2.current = true
      // 等城市和区域数据初始化后设置字段值
      setValue('province', regionUtils.getProvinceByCode(address.provinceId))
      setValue('city', regionUtils.getCityByCode(address.provinceId, address.cityId))
      setValue(
        'area',
        regionUtils.getAreaByCode(address.provinceId, address.cityId, address.areaId)
      )
      setValue('street', address.address)
      setValue('contact', address.contact)
      setValue('phone', address.phone)
    }
  }, [address, cities, areas])

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
      provinceId: editedAddress.province?.province,
      cityId: editedAddress.city?.city,
      areaId: editedAddress.area?.area,
      username: '',
      isDefault: 0, // 是否为默认地址
    }
    if (isEdit) {
      await updateAddress({
        ..._editedAddress,
        id: address.id,
      })
      reset()
      onClose()
      handleConfirm()
    } else {
      await addAddress(_editedAddress)
      reset()
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
          onSuccess={() => {
            reset()
            onClose()
          }}
        />
      )}
      {(isUpdateSuccess || isUpdateError) && (
        <HandleResponse
          isError={isUpdateError}
          isSuccess={isUpdateSuccess}
          error={updateError?.data?.message}
          message={updateData?.message}
          onSuccess={() => {
            reset()
            onClose()
          }}
        />
      )}

      <Modal
        isShow={isShow}
        onClose={() => {
          reset()
          onClose()
        }}
        effect="bottom-to-top"
      >
        <Modal.Content
          onClose={() => {
            reset()
            onClose()
          }}
          className="flex flex-col h-full px-5 py-3 bg-white md:rounded-lg gap-y-5 "
        >
          <Modal.Header
            onClose={() => {
              reset()
              onClose()
            }}
          >
            地址管理
          </Modal.Header>
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
                      onChange={() => {
                        setValue('city', {})
                        setValue('area', {})
                      }}
                    />
                    <DisplayError errors={formErrors.province?.name} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Combobox
                      label="城市"
                      control={control}
                      name="city"
                      list={cities || []}
                      placeholder="请选择您所在的城市"
                      onChange={() => {
                        setValue('area', {})
                      }}
                    />
                    <DisplayError errors={formErrors.city?.name} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Combobox
                      label="区县"
                      control={control}
                      name="area"
                      list={areas || []}
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
