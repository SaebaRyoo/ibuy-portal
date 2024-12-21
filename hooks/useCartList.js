import { useGetCartListQuery } from '@/store/services'
import { useAppDispatch } from './useRedux'
import { setCartData } from '@/store'
import useVerify from './useVerify'
import { useEffect } from 'react'

export default function useCartList() {
  const dispatch = useAppDispatch()
  const isVerify = useVerify()

  const { data, isLoading, error, isError, isSuccess, refetch } = useGetCartListQuery(undefined, {
    skip: !isVerify,
  })

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setCartData(data.data))
    }
  }, [isSuccess, data, dispatch]) // 仅在 data 或 isSuccess 更新时触发

  return { cartData: data?.data, isVerify, isLoading, error, isError, refetch }
}
