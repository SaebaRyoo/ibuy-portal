'use client'

import { ArrowLink, ResponsiveImage } from '@/components'

export default function ForbiddenPage() {
  return (
    <main className="flex flex-col items-center justify-center py-8 gap-y-6 xl:mt-36">
      <p className="text-base font-semibold text-black">403 Forbidden</p>
      <p className="text-lg text-gray-500">抱歉，您没有权限访问此页面</p>
      <ArrowLink path="/">返回首页</ArrowLink>
      <ResponsiveImage
        dimensions="w-full max-w-lg h-72"
        src="/icons/page-not-found.png"
        layout="fill"
        alt="403"
      />
    </main>
  )
}
