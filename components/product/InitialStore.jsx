'use client'

import { useAppDispatch } from '@/hooks'

import { addToLastSeen } from '@/store'
import { useEffect } from 'react'

const InitialStore = props => {
  const { product } = props

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      addToLastSeen({
        productID: product._id,
        image: product.images[0],
        title: product.title,
      })
    )
  }, [product._id])
  return null
}

export default InitialStore
