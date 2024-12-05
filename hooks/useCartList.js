import { useGetCartListQuery } from '@/store/services'
import { useAppDispatch } from './useRedux'
import { setCartData } from '@/store'
import useVerify from './useVerify'

export default function useCartList() {
  const dispatch = useAppDispatch()
  const isVerify = useVerify()

  const { data, isLoading, error, isError, isSuccess } = useGetCartListQuery(undefined, {
    skip: !isVerify,
  })

  if (isSuccess) {
    dispatch(setCartData(data?.data))
  }

  return { cartData: data?.data, isVerify, isLoading, error, isError }
}
