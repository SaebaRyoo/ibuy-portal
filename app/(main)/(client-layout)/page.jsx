import {
  BannerOne,
  BannerTwo,
  BestSellsSlider,
  Categories,
  DiscountSlider,
  Slider as MainSlider,
} from '@/components'
import { enSiteTitle, siteTitle } from '@/utils'

export const metadata = {
  title: `${siteTitle} | ${enSiteTitle}`,
}

// export const revalidate = 20
export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }) {
  const currentCategory = []
  const childCategories = []

  const sliders = []

  const bannerOneType = []
  const bannerTwoType = []

  return (
    <main className="min-h-screen container space-y-24">
      <div className="py-4 mx-auto space-y-24 xl:mt-36">
        <MainSlider data={sliders} />
        {/* <DiscountSlider currentCategory={currentCategory} /> */}
        <Categories
          childCategories={{ categories: childCategories, title: '所有分类' }}
          color={currentCategory?.colors?.start}
          name={currentCategory?.name}
          homePage
        />
        <BannerOne data={bannerOneType} />
        <BestSellsSlider categorySlug={currentCategory?.slug} />
        <BannerTwo data={bannerTwoType} />
      </div>
    </main>
  )
}
