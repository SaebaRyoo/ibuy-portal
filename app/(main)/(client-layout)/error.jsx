'use client' // Error components must be Client Components

import { ArrowLink, Button, ResponsiveImage } from '@/components'
import { useEffect } from 'react'

const ERROR_CONFIG = {
  403: {
    title: '403 Forbidden',
    message: '抱歉，您没有权限访问此页面',
  },
  500: {
    title: '500 Server Error',
    message: '服务器开小差了，请稍后再试',
  },
}

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  // 从 error.digest 或 error.message 中提取状态码
  const statusCode = error?.digest ? Number(error.digest) : null
  const config = ERROR_CONFIG[statusCode]

  if (config) {
    return (
      <main className="flex flex-col items-center justify-center py-8 gap-y-6 xl:mt-36">
        <p className="text-base font-semibold text-black">{config.title}</p>
        <p className="text-lg text-gray-500">{config.message}</p>
        <ArrowLink path="/">返回首页</ArrowLink>
        <ResponsiveImage
          dimensions="w-full max-w-lg h-72"
          src="/icons/page-not-found.png"
          layout="fill"
          alt={String(statusCode)}
        />
      </main>
    )
  }

  return (
    <main className="lg:px-3 container xl:mt-32">
      <div className="py-20 mx-auto space-y-3 text-center w-fit">
        <h5 className="text-xl">{error.name}</h5>
        <p className="text-lg text-cPink">出现异常，请检查您的地址是否有误，或者联系管理员</p>
        <Button
          className="mx-auto"
          onClick={() => {
            console.log('发送异常警报通知到OA系统', error.message)
          }}
        >
          通知我们
        </Button>
      </div>
    </main>
  )
}
