import Link from 'next/link'
import { Icons, Search, Signup, Cart, Navbar, LogoH } from 'components'

export default function Header() {
  return (
    <>
      <header className="px-4 shadow bg-white fixed z-20 top-0 left-0 right-0">
        <div className="container flex py-2 justify-around">
          <div className="inline-flex items-center justify-between w-full border-b lg:border-b-0 lg:max-w-min lg:mr-8">
            <Link passHref href="/">
              <LogoH className="w-40 h-14" />
            </Link>
          </div>
          <div className="flex items-center flex-grow gap-4">
            <Navbar />
            <Search className="flex flex-grow space-x-7" />
          </div>
          <div className="inline-flex items-center justify-between py-2 border-b lg:border-b-0 space-x-10">
            <div className="inline-flex items-center space-x-4 pr-4">
              <Cart />
              <Signup />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
