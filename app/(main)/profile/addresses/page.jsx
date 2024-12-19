'use client'

import { Address, Icons, Skeleton, AddressTable } from '@/components'

import { useTitle } from '@/hooks'
import { useGetAddressListQuery } from '@/store/services'

const BasicAddresses = () => {
  useTitle('地址管理')
  const { data, isLoading, isSuccess, isFetching, error, isError, refetch } =
    useGetAddressListQuery(null)

  // loading
  if (isLoading) {
    return (
      <section className="flex-1 px-5 ">
        <div className="flex justify-between py-4 border-b border-gray-200">
          <Skeleton.Item animated="background" height="h-5" width="w-52" />
        </div>
        <div className="my-2 space-y-3 text-gray-500">
          <div className="flex items-center gap-x-2 ">
            <Icons.UserLocation className="text-gray-500 icon" />
            <Skeleton.Item animated="background" height="h-5" width="w-40" />
          </div>
          <div className="flex items-center gap-x-2 ">
            <Icons.Post className="text-gray-500 icon" />
            <Skeleton.Item animated="background" height="h-5" width="w-40" />
          </div>
          <div className="flex items-center gap-x-2 ">
            <Icons.Phone className="text-gray-500 icon" />
            <Skeleton.Item animated="background" height="h-5" width="w-40" />
          </div>

          <div className="flex items-center gap-x-2 ">
            <Icons.User className="text-gray-500 icon" />
            <Skeleton.Item animated="background" height="h-5" width="w-40" />
          </div>
        </div>
      </section>
    )
  }

  // Render
  return (
    <main>
      <AddressTable dataSource={data?.data} refetch={refetch} />
    </main>
  )
}

export default BasicAddresses
