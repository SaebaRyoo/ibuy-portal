'use client'

import { ComingSoon } from 'components'
import { useTitle } from '@/hooks'

const Lists = () => {
  useTitle('我的收藏')
  // Render
  return (
    <main>
      <ComingSoon />
    </main>
  )
}

export default Lists
