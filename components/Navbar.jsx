'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Icons, NavbarSkeleton, ResponsiveImage } from 'components'
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
  const [hover, setHover] = useState(false)

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
      <button
        className="flex-center text-sm px-2 gap-x-1"
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Icons.Bars className="icon" />
        商品分类
      </button>

      {/* Overlay background when hovering */}
      {hover && <div className="fixed left-0 z-20 w-full h-screen top-28 bg-gray-400/50" />}

      {/* Category dropdown container */}
      {hover && (
        <div
          className="absolute z-40 w-full bg-white rounded-md shadow-lg border border-gray-100 top-8"
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="flex">
            {/* Level 1 Categories */}
            <ul className="border-l-2 border-gray-100 w-72">
              {categories &&
                categories
                  .filter(category => category.parentId === 0)
                  .map(levelOneCategory => (
                    <li
                      key={levelOneCategory.id}
                      className="w-full px-2 py-0.5 text-sm hover:bg-gray-100 group"
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
                                className="px-3 text-xs font-medium text-gray-700"
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
      )}
    </div>
  )
}
