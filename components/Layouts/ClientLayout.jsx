import { Header, Footer } from 'components'

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      <main className="mt-36 container">{children}</main>
      <Footer />
    </>
  )
}
