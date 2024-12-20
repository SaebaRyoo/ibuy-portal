'use client'

import { useTitle } from '@/hooks'
import { ComingSoon } from 'components'

const PersonalInfo = () => {
  useTitle('账户信息')

  // Render
  return (
    <>
      <main>
        <ComingSoon />
      </main>
    </>
  )
}

export default PersonalInfo
