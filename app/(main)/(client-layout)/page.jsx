import { BestSellsSlider } from '@/components'
import { enSiteTitle, siteTitle } from '@/utils'

export const metadata = {
  title: `${siteTitle} | ${enSiteTitle}`,
}

// export const revalidate = 20
export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }) {
  return (
    <main className="min-h-screen container space-y-24">
      <div className="py-4 mx-auto space-y-24 xl:mt-36">
        <BestSellsSlider />
      </div>
    </main>
  )
}
