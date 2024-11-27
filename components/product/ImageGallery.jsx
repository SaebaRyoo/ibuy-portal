'use client'

import { useState } from 'react'

import { ResponsiveImage, SpecialSell } from 'components'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

const ImageGallery = props => {
  // Porps
  const { images, discount, inStock, productName } = props
  const _images = images ?? []
  const _discount = discount ?? 0
  const _inStock = inStock ?? 0
  const _productName = productName ?? ''

  // States
  const [currentImage, setCurrentImage] = useState(0)

  // Render
  return (
    <section className="mb-5 lg:col-span-3 ">
      <div className="hidden lg:block">
        <SpecialSell discount={_discount} inStock={_inStock} />
        <ResponsiveImage
          dimensions="lg:h-[320px] lg:w-[320px] xl:h-[420px] xl:w-[420px] 2xl:h-[500px] 2xl:w-[500px]"
          className="mx-auto"
          src={_images[currentImage]}
          alt={_productName}
        />

        <div className="flex mt-5 gap-x-3">
          {_images.map((image, index) => (
            <ResponsiveImage
              key={index}
              dimensions="h-24 w-24"
              className={`relative h-24 w-24 cursor-pointer border-2 border-transparent rounded-md overflow-hidden ${
                index === currentImage && 'border-gray-300 shadow-3xl'
              }`}
              onClick={() => setCurrentImage(index)}
              src={image}
              alt={_productName}
            />
          ))}
        </div>
      </div>
      <div className="lg:hidden">
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
          {_images.map((image, index) => (
            <SwiperSlide key={index}>
              <ResponsiveImage dimensions="h-[95vw] w-full" src={image} alt={_productName} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ImageGallery
