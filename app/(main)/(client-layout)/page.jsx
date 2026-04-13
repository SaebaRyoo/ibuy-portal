import { BestSellsSlider, SeckillBanner } from '@/components'
import { enSiteTitle, siteTitle } from '@/utils'

export const metadata = {
  title: `${siteTitle} | ${enSiteTitle}`,
}

export default async function Home({ searchParams }) {
  return (
    <main className="min-h-screen container space-y-24">
      <div className="py-4 mx-auto space-y-24 xl:mt-36">
        <SeckillBanner />
        <BestSellsSlider />
      </div>
    </main>
  )
}
