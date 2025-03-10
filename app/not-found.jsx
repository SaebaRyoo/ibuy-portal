export const metadata = {
  title: '404 Not Found!',
}

import StoreProvider from 'app/StoreProvider'
import { Suspense } from 'react'
import { ArrowLink, ResponsiveImage, ClientLayout } from '@/components'

export default function NotFoundPage() {
  // Render
  return (
    <StoreProvider>
      <Suspense>
        <ClientLayout>
          <main className="flex flex-col items-center justify-center py-8 gap-y-6 xl:mt-36">
            <p className="text-base font-semibold text-black">404 Not Found!</p>
            <ArrowLink path="/">返回首页</ArrowLink>
            <ResponsiveImage
              dimensions="w-full max-w-lg h-72"
              src="/icons/page-not-found.png"
              layout="fill"
              alt="404"
            />
          </main>
        </ClientLayout>
      </Suspense>
    </StoreProvider>
  )
}
