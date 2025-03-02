'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeToken } from '@/store/slices/user.slice'

export default function AppRoot({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    // 客户端加载时初始化 token
    dispatch(initializeToken())
  }, [dispatch])

  return <>{children}</>
}
