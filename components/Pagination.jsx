import { Icons } from 'components'
import { useMediaQuery } from 'hooks'
import { useState } from 'react'

export default function Pagination({
  pageSize,
  pageNumber,
  total,
  totalPages,
  changeRoute,
  section,
  client,
}) {
  const isDesktop = useMediaQuery('(min-width:1024px)')
  const [jumpPage, setJumpPage] = useState('')

  // Handlers
  const scrollToTop = () => {
    const element = document.getElementById(section)
    const scrollY = client && isDesktop ? element?.offsetTop - 115 : element?.offsetTop
    window.scrollTo(0, scrollY)
  }

  const handlePageChange = pageNum => {
    changeRoute({ pageNum })
    scrollToTop()
  }

  const handleJumpInputChange = e => {
    const value = e.target.value
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setJumpPage(value)
    }
  }

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (page && page >= 1 && page <= totalPages) {
      handlePageChange(page)
      setJumpPage('')
    }
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleJump()
    }
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // 始终显示第一页
    pages.push(1)

    if (pageNumber > 4) {
      pages.push('...')
    }

    // 当前页附近的页码
    let start = Math.max(2, pageNumber - 2)
    let end = Math.min(totalPages - 1, pageNumber + 2)

    if (pageNumber <= 4) {
      end = 5
    }

    if (pageNumber >= totalPages - 3) {
      start = totalPages - 4
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (pageNumber < totalPages - 3) {
      pages.push('...')
    }

    // 始终显示最后一页
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const PageButton = ({ page, isActive, isDisabled, children }) => (
    <button
      onClick={() => !isDisabled && handlePageChange(page)}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center min-w-[32px] px-3 py-1.5 text-sm rounded-md
        ${
          isActive
            ? 'z-10 bg-cPink text-white focus:outline-none'
            : 'text-gray-700 hover:text-cPink'
        }
        ${isDisabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}
        ${children === '...' ? 'cursor-default hover:text-gray-700' : ''}
      `}
    >
      {children || page}
    </button>
  )

  return (
    <nav className="flex items-center justify-center space-x-2 mt-4">
      {/* 上一页按钮 */}
      <PageButton page={pageNumber - 1} isDisabled={pageNumber === 1}>
        <Icons.ArrowLeft className="w-5 h-5" />
      </PageButton>

      {/* 页码按钮 */}
      {getPageNumbers().map((page, index) => (
        <PageButton
          key={index}
          page={page}
          isActive={page === pageNumber}
          isDisabled={page === '...'}
        >
          {page}
        </PageButton>
      ))}

      {/* 下一页按钮 */}
      <PageButton page={pageNumber + 1} isDisabled={pageNumber === totalPages}>
        <Icons.ArrowRight2 className="w-5 h-5" />
      </PageButton>

      {/* 跳转页面输入框 */}
      <div className="flex items-center space-x-2 ml-4">
        <span className="text-sm text-gray-600">跳至</span>
        <input
          type="text"
          value={jumpPage}
          onChange={handleJumpInputChange}
          onKeyDown={e => e.key === 'Enter' && handleJump()}
          className="w-12 h-8 px-2 text-center border border-gray-300 rounded-md focus:border-cPink focus:outline-none"
          placeholder={pageNumber}
        />
        <span className="text-sm text-gray-600">页</span>
        <button
          onClick={handleJump}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-cPink rounded-md"
        >
          确定
        </button>
      </div>
    </nav>
  )
}
