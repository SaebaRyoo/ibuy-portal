'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Icons, NavbarSkeleton, ResponsiveImage } from 'components'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useGetCategoriesQuery } from '@/store/services'

export default function Navbar() {
  // Fetch Categories Data
  const { categories, isLoading } = useGetCategoriesQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      categories: data?.data,
      isLoading,
    }),
  })

  const [activeId, setActiveId] = useState(null)

  const handleActive = activeId => {
    setActiveId(activeId)
  }

  // If loading, display skeleton
  if (isLoading) {
    return <NavbarSkeleton />
  }

  return (
    <div className="hidden lg:block group">
      {/* Button to toggle category display */}
      <Popover className="relative">
        <PopoverButton aria-label="Toggle category menu">
          <div className="flex items-center justify-center space-x-2 p-2">
            <Icons.Bars className="icon" />
            <span>商品分类</span>
          </div>
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom"
          modal={true}
          className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm transition duration-300 ease-in-out transform scale-95 opacity-0 data-[open]:scale-100 data-[open]:opacity-100"
        >
          <div className="w-full bg-white rounded-md shadow-lg border border-gray-100">
            <div className="flex">
              {/* Level 1 Categories */}
              <ul className="border-l-2 border-gray-100 w-72">
                {categories &&
                  categories
                    .filter(category => category.parentId === 0)
                    .map(levelOneCategory => (
                      <li
                        key={levelOneCategory.id}
                        className="w-full px-2 py-0.5 text-sm hover:bg-gray-200 group"
                        onMouseOver={() => handleActive(levelOneCategory.id)}
                      >
                        <div className="px-3 py-3 flex gap-x-1.5 items-center">
                          <ResponsiveImage
                            dimensions="w-7 h-7"
                            className="grayscale"
                            src=""
                            alt={levelOneCategory.name}
                          />
                          <span>{levelOneCategory.name}</span>
                        </div>
                      </li>
                    ))}
              </ul>

              {/* Level 2 and 3 Categories */}
              <ul className="flex flex-wrap w-full gap-10 px-2 py-4">
                {activeId &&
                  categories &&
                  categories.map(levelTwoCategory => {
                    if (levelTwoCategory.parentId !== activeId) return null

                    return (
                      <li key={levelTwoCategory.id} className="h-fit">
                        {/* Level 2 Category */}
                        <div className="flex-center px-2 mb-1 text-sm font-semibold tracking-wider text-gray-700 border-l-2 border-red-500">
                          {levelTwoCategory.name}
                          <Icons.ArrowRight2 className="icon" />
                        </div>

                        {/* Level 3 Categories */}
                        <ul className="space-y-1">
                          {categories
                            .filter(category => category.parentId === levelTwoCategory.id)
                            .map(levelThreeCategory => (
                              <li key={levelThreeCategory.id}>
                                <Link
                                  href={`/search?category=${levelThreeCategory.name}`}
                                  className="px-3 text-xs font-medium text-gray-700 hover:text-gray-900"
                                  aria-label={`Go to ${levelThreeCategory.name} category`}
                                >
                                  {levelThreeCategory.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
