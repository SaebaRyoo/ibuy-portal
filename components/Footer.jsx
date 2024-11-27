import Image from 'next/image'

import { Icons, Services } from 'components'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="pt-4 mt-8 border-t border-gray-200 bg-gray-50">
      <div className="container px-3  space-y-8 mx-auto ">
        {/* Logo & scroll to top */}
        <div className="flex justify-between">
          <div>
            <div className="flex flex-col gap-y-2 lg:flex-row lg:space-x-5">
              <span>我们每周 7 天、每天 24 小时为您解答</span>
              <span className="hidden lg:block bg-gray-300 w-[2px]" />
              <span>我的微信：xxxx</span>
            </div>
          </div>
          <div className="min-w-max">
            <button
              type="button"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center px-3 py-1 border border-gray-300 rounded-md"
            >
              <span className="text-sm ">回到顶部</span>
              <Icons.ArrowUp className="text-gray-400 h-7 w-7" />
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <Services />
        </div>

        <div className="space-y-8 flex justify-between items-center">
          {/* socials */}
          <div className="flex items-center justify-between">
            <p className="lg:mr-20">更多联系方式！</p>
            <div className="flex space-x-5">
              <Link target="_blank" href="https://www.google.com">
                <Icons.Linkedin className="w-8 h-8 text-gray-400" />
              </Link>
              <Link target="_blank" href="https://www.google.com">
                <Icons.Instagram className="w-8 h-8 text-gray-400" />
              </Link>
              <Link target="_blank" href="https://www.google.com">
                <Icons.Youtube className="w-8 h-8 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
