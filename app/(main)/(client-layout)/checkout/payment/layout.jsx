import { siteTitle } from '@/utils'

export const metadata = {
  title: `支付状态-${siteTitle}`,
}

export default function Layout({ children }) {
  return <>{children}</>
}
