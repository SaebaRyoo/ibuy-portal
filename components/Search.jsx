'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Icons, EmptySearchList, ShowWrapper } from 'components'

import { truncate } from 'utils'

import { useSearchProductsQuery } from '@/store/services'

import { useDebounce } from 'hooks'

export default function Search() {
  // States
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 1200)

  // Search Data
  const { searchData, isFetching, isSuccess, error, isError, refetch } = useSearchProductsQuery(
    {
      keywords: search,
    },
    {
      skip: !Boolean(debouncedSearch) || search !== debouncedSearch,
      selectFromResult: ({ isFetching, data, isSuccess, error, isError, refetch }) => {
        return { searchData: data?.data.data ?? {}, isFetching, isSuccess, error, isError, refetch }
      },
    }
  )

  const handleChange = e => {
    setSearch(e.target.value)
  }

  const handleRemoveSearch = () => {
    setSearch('')
  }

  return (
    <div className="relative flex flex-row flex-grow max-w-3xl rounded-md bg-white">
      <div className="flex flex-row flex-grow my-3 rounded-md bg-zinc-200/80">
        <div className="p-2">
          <Icons.Search className="icon text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="搜索"
          className="flex-grow p-1 text-left bg-transparent outline-none input focus:border-none"
          value={search}
          onChange={handleChange}
        />
        <button type="button" className="p-2" onClick={handleRemoveSearch}>
          {search.length > 0 && <Icons.Close className="icon text-gray-500" />}
        </button>
      </div>
      <div className="absolute top-[54px] w-full overflow-y-auto lg:max-h-[500px] bg-white">
        <ShowWrapper
          error={error}
          isError={isError}
          refetch={refetch}
          isFetching={isFetching}
          isSuccess={isSuccess}
          dataLength={searchData ? searchData?.rows?.length : 0}
          emptyComponent={<EmptySearchList />}
        >
          <div className="px-2 py-2">
            {searchData?.rows?.length &&
              searchData?.rows?.length > 0 &&
              search.length > 0 &&
              searchData?.rows?.map(item => (
                <article key={item.id} className="py-2">
                  <Link href={`/search?keywords=${search}`}>
                    <span className="py-2 text-sm">{truncate(item.name, 70)}</span>
                  </Link>
                </article>
              ))}
          </div>
        </ShowWrapper>
      </div>
    </div>
  )
}
