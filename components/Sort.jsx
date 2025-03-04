'use client'

import { useEffect, useState } from 'react'
import { Icons } from 'components'
import { useUrlQuery } from '@/hooks'

const sortFields = [
  { field: 'price', name: '价格' },
  { field: 'saleNum', name: '销量' },
]

const sortRules = {
  ASC: 'asc',
  DESC: 'desc',
}

const Sort = ({ handleChangeRoute }) => {
  const query = useUrlQuery()
  const [activeField, setActiveField] = useState(null)
  const [activeRule, setActiveRule] = useState(null)

  useEffect(() => {
    // 从 URL 查询参数中获取排序状态
    if (query.sortField) {
      setActiveField(query.sortField)
      setActiveRule(query.sortRule || sortRules.DESC)
    } else {
      setActiveField(null)
      setActiveRule(null)
    }
  }, [query])

  const handleSort = field => {
    if (activeField === field) {
      // 如果点击的是当前字段，切换排序规则
      const newRule = activeRule === sortRules.DESC ? sortRules.ASC : sortRules.DESC
      setActiveRule(newRule)
      handleChangeRoute({ sortField: field, sortRule: newRule })
    } else {
      // 如果点击的是新字段，设置为默认降序
      setActiveField(field)
      setActiveRule(sortRules.DESC)
      handleChangeRoute({ sortField: field, sortRule: sortRules.DESC })
    }
  }

  const getSortIcon = field => {
    if (activeField !== field) {
      return <Icons.Sort className="w-4 h-4 text-gray-400" />
    }
    return activeRule === sortRules.DESC ? (
      <Icons.ArrowDown className="w-4 h-4 text-cPink" />
    ) : (
      <Icons.ArrowUp className="w-4 h-4 text-cPink" />
    )
  }

  return (
    <div className="flex items-center space-x-6">
      {sortFields.map(({ field, name }) => (
        <button
          key={field}
          onClick={() => handleSort(field)}
          className={`flex items-center space-x-1 py-2 px-3 rounded-md transition-colors
            ${activeField === field ? 'text-cPink' : 'text-gray-600 hover:text-cPink'}`}
        >
          <span>{name}</span>
          {getSortIcon(field)}
        </button>
      ))}
    </div>
  )
}

export default Sort
