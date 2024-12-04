import { useGetCartListQuery } from '@/store/services'
import useVerify from './useVerify'

export default function useUserInfo() {
  const isVerify = useVerify()

  const { data, isLoading, error, isError } = useGetCartListQuery(undefined, {
    skip: !isVerify,
  })

  return { cartData: data?.data, isVerify, isLoading, error, isError }
}
