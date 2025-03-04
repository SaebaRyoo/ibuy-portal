'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Icons, EmptySearchList, DropList } from 'components'
import { truncate } from 'utils'

import { useSearchProductsQuery } from '@/store/services'

import { useDebounce } from 'hooks'

export default function Search() {
  // States
  const [search, setSearch] = useState('')
  const [showDropList, setShowDropList] = useState(false)

  // Debounced search term
  const debouncedSearch = useDebounce(search, 1200)

  // Search query
  const { searchData, isFetching, isSuccess, error, isError, refetch } = useSearchProductsQuery(
    {
      keywords: search,
    },
    {
      skip: !Boolean(debouncedSearch) || search !== debouncedSearch, // Prevent refetching if input is not debounced
      selectFromResult: ({ isFetching, data, isSuccess, error, isError, refetch }) => ({
        searchData: data?.data?.data ?? {},
        isFetching,
        isSuccess,
        error,
        isError,
        refetch,
      }),
    }
  )

  // Handle user input change
  const handleChange = e => {
    setSearch(e.target.value)
    setShowDropList(!!e.target.value.length)
  }

  // Clear search input
  const handleRemoveSearch = () => {
    setSearch('')
    setShowDropList(false)
  }

  return (
    <div className="relative flex flex-row flex-grow max-w-3xl rounded-md bg-white">
      {/* 保持原样的搜索框样式 */}
      <div className="flex flex-row flex-grow my-3 rounded-md bg-zinc-200/80">
        <div className="p-2">
          <Icons.Search className="icon text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="搜索"
          className="flex-grow p-1 text-left bg-transparent outline-none border-none input focus:outline-none focus:border-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none appearance-none"
          value={search}
          onChange={handleChange}
          style={{ WebkitAppearance: 'none' }}
        />
        <button type="button" className="p-2" onClick={handleRemoveSearch}>
          {search.length > 0 && <Icons.Close className="icon text-gray-500" />}
        </button>
      </div>

      {/* 搜索结果下拉区域 */}
      <div className="absolute top-[54px] w-full max-h-[500px] overflow-y-auto bg-white rounded-b-lg shadow-lg z-10">
        <DropList
          show={showDropList}
          onClose={() => setShowDropList(false)}
          error={error}
          isError={isError}
          refetch={refetch}
          isFetching={isFetching}
          isSuccess={isSuccess}
          dataLength={searchData?.rows?.length || 0}
          emptyComponent={<EmptySearchList />}
        >
          <div className="px-4 py-2">
            {searchData?.rows?.length > 0 &&
              searchData.rows.map(item => (
                <article key={item.id} className="py-2">
                  <Link
                    onClick={() => setSearch(item.name)}
                    href={`/search?keywords=${item.name}`}
                    passHref
                  >
                    <span className="block py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-150 ease-in-out text-gray-700 hover:bg-gray-50">
                      <span className="text-sm font-medium">{truncate(item.name, 70)}</span>
                    </span>
                  </Link>
                </article>
              ))}
          </div>
        </DropList>
      </div>
    </div>
  )
}
