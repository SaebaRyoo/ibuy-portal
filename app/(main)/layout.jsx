'use client'

import { useEffect, useState } from 'react'

// Store
import StoreProvider from 'app/StoreProvider'

// Components
import AppRoot from 'app/AppRoot'

import { PageLoading, Alert } from '@/components'

export default function Layout({ children }) {
  // Fix Hydration failed
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  return (
    <StoreProvider>
      <AppRoot>
        {children}
        <Alert />
        <PageLoading />
      </AppRoot>
    </StoreProvider>
  )
}
