'use client'

import { ArrowLink, ResponsiveImage } from '@/components'

export default function ServerErrorPage() {
  return (
    <main className="flex flex-col items-center justify-center py-8 gap-y-6 xl:mt-36">
      <p className="text-base font-semibold text-black">500 Server Error</p>
      <p className="text-lg text-gray-500">服务器开小差了，请稍后再试</p>
      <ArrowLink path="/">返回首页</ArrowLink>
      <ResponsiveImage
        dimensions="w-full max-w-lg h-72"
        src="/icons/page-not-found.png"
        layout="fill"
        alt="500"
      />
    </main>
  )
}
