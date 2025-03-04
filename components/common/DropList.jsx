'use client'

import { useEffect, useRef } from 'react'
import { BigLoading, EmptyCustomList } from 'components'

export default function DropList({
  show,
  onClose,
  isError,
  error,
  refetch,
  isFetching,
  dataLength,
  isSuccess,
  emptyComponent,
  loadingComponent,
  children,
}) {
  const dropListRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropListRef.current && !dropListRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <section ref={dropListRef}>
      {isError ? (
        <div className="py-20 mx-auto space-y-3 text-center w-fit">
          <h5 className="text-xl">出现异常</h5>
          <p className="text-lg text-cPink">{error?.data?.err}</p>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={refetch}
          >
            重试
          </button>
        </div>
      ) : isFetching ? (
        <div className="px-3">{loadingComponent || <BigLoading />}</div>
      ) : isSuccess && dataLength > 0 ? (
        <div onClick={onClose}>{children}</div>
      ) : isSuccess && dataLength === 0 ? (
        <>{emptyComponent || <EmptyCustomList />}</>
      ) : null}
    </section>
  )
}
